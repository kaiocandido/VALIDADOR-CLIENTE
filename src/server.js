// Leitura do arquivo .env
// para acessar as variáveis de ambiente
// como process.env.JWT_SECRET
// e process.env.JWT_EXPIRATION
import "dotenv/config";
import app from "./app";
// Configuração do servidor
app.listen(3001, () => console.log("Server is running on port 3001"));
