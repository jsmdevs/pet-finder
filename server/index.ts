import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 3000;

function main() {
    const app = express();
    app.use(express.json());
    app.use(cors());

    app.listen(PORT, () => {
        console.log(`Server running in localhost:${PORT}`);
    })
        .on('error', (err:any) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`Error: Port ${PORT} is already in use.`)
            } else {
                console.error('Server failed to start:', err);
            }
            process.exit(1);
        })
}

main();