let  mongoURI = ""

if (process.env.NODE_ENV === "production") {
 mongoURI = "mongodb://santos:1913012816@ac-gy4tjej-shard-00-00.gucwotw.mongodb.net:27017,ac-gy4tjej-shard-00-01.gucwotw.mongodb.net:27017,ac-gy4tjej-shard-00-02.gucwotw.mongodb.net:27017/?ssl=true&replicaSet=atlas-2vvflr-shard-0&authSource=admin"
} else {
    // Se NÃO for produção (ou seja, no seu PC), usa esta:
    mongoURI = "mongodb://localhost:27017/seu-banco-local";
}

export default {mongoURI}