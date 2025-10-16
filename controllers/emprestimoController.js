const db = require('../config/database');
const Emprestimo = require('../models/emprestimoModel'); 

// Usuário solicita empréstimo
exports.solicitarEmprestimo = (req, res) => {
    const { n_registro } = req.body;
    const usuario_id = req.session.userId; 
    const sql = 'INSERT INTO emprestimos (usuario_id, n_registro, status) VALUES (?, ?, "pendente")';
    
    db.query(sql, [usuario_id, n_registro], (err, results) => { 
        if (err) {
            console.error('Erro MySQL ao solicitar empréstimo:', err);
            return res.status(500).send('Erro ao solicitar empréstimo');
        }
        const successMsg = 'Solicitação recebida! Aguarde a autorização do administrador.';
        return res.redirect('/material/pesquisar?success=' + encodeURIComponent(successMsg));
    });
};

// --- NOVAS FUNÇÕES PARA A TELA DO USUÁRIO ---

/**
 * Busca e exibe o empréstimo ativo do usuário logado.
 * Retorna os detalhes do livro e a data de devolução.
 */
exports.getEmprestimoAtivo = (req, res) => {
    const userId = req.session.userId; 

    if (!userId) {
        return res.status(401).send('Usuário não autenticado.');
    }

    const query = `
        SELECT 
            e.id AS emprestimoId,    
            m.titulo, 
            m.autor,                 
            DATE_FORMAT(e.data_devolucao, '%d/%m/%Y') AS dataDevolucaoFormatada,
            e.data_devolucao AS dataDevolucaoOriginal
        FROM emprestimos e
        JOIN material m ON e.n_registro = m.n_registro
        -- Busca apenas o empréstimo ativo (autorizado)
        WHERE e.usuario_id = ? AND LOWER(e.status) = 'autorizado'
        LIMIT 1
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar empréstimo ativo:', err);
            return res.render('emprestimos/ativo', { emprestimo: null, erro: 'Erro interno ao buscar empréstimo.' });
        }

        const emprestimo = results.length > 0 ? results[0] : null;
        
        // Renderiza a view 'emprestimos/ativo' (você precisará criar essa view)
        res.render('emprestimos/ativo', {
            emprestimo: emprestimo,
            success: req.query.success || null,
            erro: req.query.erro || null
        });
    });
};

/**
 * Usuário solicita a renovação do empréstimo.
 * Renovação é automática se estiver no prazo; caso contrário, é bloqueada.
 */
exports.renovarEmprestimo = async (req, res) => {
    const userId = req.session.userId;
    // Pega o ID do empréstimo do corpo da requisição (vindo do formulário na view)
    const { emprestimoId } = req.body; 

    if (!userId) {
        return res.status(401).send('Usuário não autenticado.');
    }

    try {
        // 1. Consulta o empréstimo para verificar a data de devolução e status
        const [emprestimoResult] = await db.promise().query(
            'SELECT data_devolucao FROM emprestimos WHERE id = ? AND usuario_id = ? AND LOWER(status) = "autorizado"',
            [emprestimoId, userId]
        );

        if (emprestimoResult.length === 0) {
            const erroMsg = 'Empréstimo não encontrado, já devolvido ou não está ativo.';
            return res.redirect('/meu-emprestimo?erro=' + encodeURIComponent(erroMsg));
        }

        const dataDevolucaoOriginal = new Date(emprestimoResult[0].data_devolucao);
        const hoje = new Date();
        
        // Zera o horário para comparação correta apenas da data
        hoje.setHours(0, 0, 0, 0); 
        dataDevolucaoOriginal.setHours(0, 0, 0, 0); 
        
        // 2. Verifica se está em atraso
        if (hoje > dataDevolucaoOriginal) {
            // *** CASO: ATRASADO (Bloqueia Renovação) ***
            const erroMsg = 'Renovação não permitida. O livro está em **atraso**. Por favor, realize a devolução o mais breve possível.';
            return res.redirect('/meu-emprestimo?erro=' + encodeURIComponent(erroMsg));
        }

        // 3. CASO: NO PRAZO (Renovação Automática)
        // Calcula a nova data de devolução (ex: +15 dias a partir da data de devolução original)
        const data_devolucao_nova = new Date(dataDevolucaoOriginal);
        data_devolucao_nova.setDate(dataDevolucaoOriginal.getDate() + 15);
        const dataFormatada = data_devolucao_nova.toISOString().split('T')[0];

        const updateQuery = `
            UPDATE emprestimos 
            SET data_devolucao = ?, 
                data_renovacao_aprovada = NOW() 
            WHERE id = ? AND usuario_id = ? AND LOWER(status) = "autorizado"
        `;
        
        await db.promise().query(updateQuery, [dataFormatada, emprestimoId, userId]); 

        const successMsg = `Renovação automática realizada com sucesso! Nova data de devolução: **${dataFormatada}**`;
        return res.redirect('/meu-emprestimo?success=' + encodeURIComponent(successMsg));

    } catch (err) {
        console.error('Erro ao solicitar renovação:', err);
        const erroMsg = 'Erro interno ao processar sua solicitação de renovação.';
        return res.redirect('/meu-emprestimo?erro=' + encodeURIComponent(erroMsg));
    }
};

// --- FUNÇÕES DO ADMINISTRADOR (Seu código original) ---

// Admin vê solicitações pendentes
exports.listarPendentes = async (req, res) => {
    try {
        const emprestimos = await Emprestimo.getAllPendentes(); 
        // ... (Renderiza a view)
        res.render('emprestimos/pendentes', {
            emprestimos,
            paginaAtual: 1, 
            totalPaginas: 1, 
            success: req.query.success || undefined,
            erro: req.query.erro || undefined
        });
    } catch (err) {
        console.error(err);
        res.send('Erro ao listar empréstimos pendentes');
    }
};

// Admin autoriza empréstimo e define data de devolução
exports.autorizarEmprestimo = async (req, res) => {
    const { id } = req.params;
    try {
        const hoje = new Date();
        const data_devolucao = new Date(hoje); 
        data_devolucao.setDate(hoje.getDate() + 15); 
        const dataFormatada = data_devolucao.toISOString().split('T')[0];

        await db.promise().query(
            'UPDATE emprestimos SET status = "autorizado", data_devolucao = ? WHERE id = ?',
            [dataFormatada, id]
        );

        res.redirect('/dashboard?success=' + encodeURIComponent('Empréstimo autorizado com sucesso!'));
    } catch (err) {
        console.error('Erro ao autorizar empréstimo:', err);
        res.status(500).send('Erro ao autorizar empréstimo');
    }
};

// Admin recusa empréstimo
exports.recusarEmprestimo = async (req, res) => {
    const { id } = req.params;
    try {
        await db.promise().query(
            'UPDATE emprestimos SET status = "recusado" WHERE id = ?',
            [id]
        );
        
        res.redirect('/dashboard?success=' + encodeURIComponent('Empréstimo recusado com sucesso!'));
    } catch (err) {
        console.error('Erro ao recusar empréstimo:', err);
        res.status(500).send('Erro ao recusar empréstimo');
    }
};

// Dashboard admin com todos os empréstimos (MANTIDO)
exports.dashboardAdmin = async (req, res) => {
    try {
        // Buscar empréstimos pendentes
        const [pendentes] = await db.promise().query(`
            SELECT e.id, e.n_registro, e.status, u.nome AS usuario_nome, m.titulo
            FROM emprestimos e
            JOIN usuarios u ON e.usuario_id = u.id
            JOIN material m ON e.n_registro = m.n_registro
            WHERE e.status = 'pendente'
            ORDER BY e.id DESC
        `);

        // Buscar empréstimos autorizados (para receber devolução)
        const [ativos] = await db.promise().query(`
            SELECT e.id, e.n_registro, e.status, e.data_devolucao, u.nome AS usuario_nome, m.titulo
            FROM emprestimos e
            JOIN usuarios u ON e.usuario_id = u.id
            JOIN material m ON e.n_registro = m.n_registro
            WHERE e.status = 'autorizado'
            ORDER BY e.id DESC
        `);

        res.render('emprestimos/dashboard', { 
            pendentes,
            ativos,
            success: req.query.success || null,
            erro: req.query.erro || null
        });
    } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
        res.status(500).send('Erro ao carregar dashboard');
    }
};


exports.receberDevolucao = async (req, res) => {
    const { id } = req.params;
    const dataDevolucao = new Date().toISOString().split('T')[0];

    try {
        await db.promise().query(
            'UPDATE emprestimos SET status = "devolvido", data_devolucao = ? WHERE id = ?',
            [dataDevolucao, id] 
        );

        await db.promise().query(
            'UPDATE material SET disponivel = 1 WHERE n_registro = (SELECT n_registro FROM emprestimos WHERE id = ?)',
            [id]
        );

        res.redirect('/dashboard?success=' + encodeURIComponent('Devolução recebida e material liberado com sucesso!'));
    } catch (err) {
        console.error('Erro ao receber devolução:', err);
        res.status(500).send('Erro ao processar devolução');
    }
};