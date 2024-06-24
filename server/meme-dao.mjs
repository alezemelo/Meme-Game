import db from './db.mjs';  
import { Meme } from './WDUMmodels.mjs';  

// Function to map rows from database to Meme objects
function mapRowsToMeme(rows) {
    return rows.map(row => new Meme(row.meme_id, row.image_url));
}


export const getMeme = (limit_number) => {
    return new Promise((resolve, reject) => {
        const query = 
        `SELECT DISTINCT * FROM memes_table
        ORDER BY RANDOM()
        LIMIT ?`;
        db.all(query, [limit_number], (err, rows) => {
            if (err) {
                reject(err);
            } else if (!rows) {
                resolve({ error: 'Meme not found.' });
            } else {
                const memes = mapRowsToMeme(rows);
                resolve(memes);
            }
        });
    });
};



