import dayjs from 'dayjs';

function User(user_id, name, surname, email){
    this.user_id=user_id;
    this.name=name;
    this.surname=surname;
    this.email=email;
}

function Meme(meme_id, image_url){
    this.meme_id=meme_id;
    this.image_url=image_url;
}
function GameHistory(gh_id, user_id, game_date, score=0){
    this.gh_id=gh_id;
    this.user_id=user_id;
     // saved as dayjs object only if watchDate is truthy
    this.game_date = game_date && dayjs(game_date);
    this.score=score;
}
function Caption(caption_id, meme_id, text){
    this.caption_id=caption_id;
    this.meme_id=meme_id;
    this.text=text;
}
function Round(meme,captions){
    this.meme=meme;
    this.captions=captions;
}


export { User, Meme, GameHistory, Caption, Round};