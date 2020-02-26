let server = 'https://caderneta-api.herokuapp.com/users'

export async function createUser(user_info, callback){
  /*
  * user_info = {
  *   facebook_id: String
  *   tag: String
  *   name: String
  *   avatar_url: String
  * }
  *
  * 
  */
  fetch(server, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user_info)
  }).then(response => response.json().then(json => callback(json)))
}

export function getUserByFacebookId(id, callback){
  fetch(server + '/byfid/' + id).then(response => {
    response.json().then(json => {
      console.log("calling callback")
      callback(json)
    })
  })
}

export function getUserByTag(tag, callback){
  console.log("Requesting")
  fetch(server + '/bytag/' + tag).then(response => {
    response.json().then(json => {      
      callback(json)
    })
  })
}