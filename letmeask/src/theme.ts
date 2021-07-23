import { extendTheme } from '@chakra-ui/react'

const customTheme = extendTheme({
  styles: {
    global: {
      'html, body, input, button, textarea': {
        color: '#29292e',
        background: '#f8f8f8',
        font: '400 16px "Roboto", sans-serif',
        textStyles: {
          h1: {
            // you can also use responsive styles
            fontSize: '24px',
            fontWeight: 'bold',
            fontFamily: 'Roboto'
          }
        }
      }
    }
  }
})

export default customTheme
