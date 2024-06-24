import db from './db.mjs';  
import { Caption } from './WDUMmodels.mjs';  

// Function to map rows from database to Caption objects
function mapRowsToCaptions(rows) {
    return rows.map(row => new Caption(row.caption_id, row.meme_id, row.text));
}

export const getCaptionsToGame =(meme_id) => {
    return new Promise((resolve, reject) => {
        const query = `
           WITH selected_captions AS (
                SELECT DISTINCT caption_id, meme_id, text
                FROM captions_table
                WHERE meme_id = ?
                ORDER BY RANDOM()
                LIMIT 2
            ),
            random_captions AS (
                SELECT DISTINCT caption_id, meme_id, text
                FROM captions_table
                WHERE meme_id <> ?
                AND caption_id NOT IN (SELECT caption_id FROM selected_captions )
                ORDER BY RANDOM()
                LIMIT 5
            )
            SELECT *
            FROM (
                SELECT caption_id, meme_id, text FROM selected_captions
                UNION ALL
                SELECT caption_id, meme_id, text FROM random_captions
            ) 
            ORDER BY RANDOM();`

        db.all(query, [meme_id, meme_id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const captions = mapRowsToCaptions(rows);
                resolve(captions);
            }
        });
    }); 
}


