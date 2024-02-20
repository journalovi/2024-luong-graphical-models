import axios from 'axios'

const getBaseUrl = () => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return 'https://ner.gradient.pub'
    case 'development':
    default:
      return 'http://127.0.0.1:8080'
  }
}

export interface PredictionResponseData {
  predictions: string[][]
}

export default axios.create({
  baseURL: getBaseUrl(),
})
