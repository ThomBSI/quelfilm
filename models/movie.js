export class Movie {

    /** identifiant du film dans theMovieDB. string */
    id;
    /** titre du film en Français. string */
    title;
    /** résumé du film en français. string */
    abstract;
    /** nom du réalisateur. string */
    directorName;
    /** date de sortie du film. Date */
    releaseDate;
    /** principaux acteurs. Array<string> */
    mainActors;
    /** url de l'affiche. string */
    posterPath;
    
    constructor() {}

}