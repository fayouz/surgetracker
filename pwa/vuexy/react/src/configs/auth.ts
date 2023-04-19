// ** Config
import apiConfig from 'src/configs/api'
export default {
  meEndpoint: apiConfig.endpoint + '/users/me',
  loginEndpoint: apiConfig.endpoint + '/login',
  registerEndpoint: apiConfig.endpoint + '/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
