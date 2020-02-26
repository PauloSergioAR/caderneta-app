let server = 'https://caderneta-api.herokuapp.com'

module.exports = {

  async getTransactions(user){
    let response = await fetch(server + '/transactions/' + user)
    let json = response.json()
    console.log(json)
    return json     
  }
}