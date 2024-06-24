import db from './db.mjs'; 
import { GameHistory } from './WDUMmodels.mjs';  
import dayjs from 'dayjs';

// Function to map rows from database to Game History objects
function mapRowsToGameHistory(rows) {
    return rows.map(row => new GameHistory(row.gh_id, row.user_id, row.game_date, row.score));
}

export const getGamesHistory = (user_id)=> {
        return new Promise((resolve, reject) => {
            const query =
                `SELECT * FROM games_history_table
                 WHERE user_id = ?;`;
    
            db.all(query, [user_id], (err, rows) => {
                if (err) {
                    reject(err);
                }else {
                    const gameHistorys = mapRowsToGameHistory(rows);
                    resolve(gameHistorys);
                }
            });
        });
    };


    
    export const createGameHistory = (user_id, score, game) => {
        return new Promise((resolve, reject) => {
            if (!Array.isArray(game) || game.length === 0) {
                reject("Game data is empty or not an array.");
                return;
            }
    
            const game_date = dayjs().format('YYYY-MM-DD HH:mm');
    
            const sql = `INSERT INTO games_history_table (user_id, game_date, score) VALUES (?, ?, ?)`;
            const params = [user_id, game_date, score];
    
            db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    const gh_id = this.lastID; 
                    const gameSql = `INSERT INTO games_table (gh_id, round, meme_url, score) VALUES (?, ?, ?, ?)`;
    
                    // Insert each game record sequentially
                    const insertGameRecord = (index) => {
                        if (index >= game.length) {
                            resolve( gh_id, score, game );
                            return;
                        }
    
                        const { round, meme, score: gameScore } = game[index]; // Destructure round, meme, and score
                        const gameParams = [gh_id, round, meme, gameScore];
    
                        db.run(gameSql, gameParams, function(err) {
                            if (err) {
                                reject(err); 
                            } else {
                                insertGameRecord(index + 1); 
                            }
                        });
                    };
    
                    // Start inserting game records from index 0
                    insertGameRecord(0);
                }
            });
        });
    };
    

    export const getGamesByGhId = (gh_id) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT round, meme_url, gt.score
                FROM games_table AS gt
                JOIN games_history_table AS ght ON gt.gh_id = ght.gh_id
                WHERE gt.gh_id = ?;
            `;
    
            db.all(query, [gh_id], (err, rows) => {
                if (err) {
                    reject(`Error retrieving game data: ${err.message}`);
                } else {
                    resolve(rows);
                }
            });
        });
    };
    
    export const clearGameTables = () => {
        return new Promise((resolve, reject) => {
            const clearGamesTableSql = `DELETE FROM games_table`;
            const clearGamesHistoryTableSql = `DELETE FROM games_history_table`;
            const resetGamesTableSeqSql = `DELETE FROM sqlite_sequence WHERE name='games_table'`;
            const resetGamesHistoryTableSeqSql = `DELETE FROM sqlite_sequence WHERE name='games_history_table'`;
    
            db.run(clearGamesTableSql, [], function(err) {
                if (err) {
                    reject(`Error clearing games_table: ${err.message}`);
                    return;
                }
    
                db.run(clearGamesHistoryTableSql, [], function(err) {
                    if (err) {
                        reject(`Error clearing games_history_table: ${err.message}`);
                        return;
                    }
    
                    db.run(resetGamesTableSeqSql, [], function(err) {
                        if (err) {
                            reject(`Error resetting games_table sequence: ${err.message}`);
                            return;
                        }
    
                        db.run(resetGamesHistoryTableSeqSql, [], function(err) {
                            if (err) {
                                reject(`Error resetting games_history_table sequence: ${err.message}`);
                            } else {
                                resolve("Both tables cleared and sequences reset successfully.");
                            }
                        });
                    });
                });
            });
        });
    };
    
    
    

