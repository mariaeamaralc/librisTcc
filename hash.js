
const bcrypt = require('bcrypt');
const saltRounds = 10; 
const senhaAdmin = '1234'; 

console.log("Gerando hash para a senha: " + senhaAdmin);

bcrypt.hash(senhaAdmin, saltRounds, function(err, hash) {
    if (err) {
        console.error("Erro ao gerar hash:", err);
    } else {
        console.log("------------------------------------------------------------------");
        console.log("✅ HASH GERADO COM SUCESSO (COPIE TODO O CONTEÚDO ABAIXO):");
        console.log(hash); 
        console.log("------------------------------------------------------------------");
        console.log("Agora, use o hash acima para inserir o administrador no banco de dados.");
    }
});