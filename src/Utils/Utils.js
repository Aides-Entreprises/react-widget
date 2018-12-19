export default class Rubrique {
    
    static async getMoviesFromApiAsync() {
        let response = await fetch('https://facebook.github.io/react-native/movies.json')
        return response.json();
    }
    
}