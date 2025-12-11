//Author : Diogo Rangel Dos Santos
//Data: 13/03/2025
//Descrição: Este script tem como objetivo encontrar o menor número de uma lista de números

function EncontrarMenorNumero(lista) {
     // Usa o método Math.min com o operador spread (...) para encontrar o menor número
    return Math.min(...lista)
}

//Definição da lista de números
const listaNumeros = Object.freeze([150, 20, 7, 12, 10, 400])

//Invocação da função e exibição do resultado
console.log("O menor número da lista é:" , EncontrarMenorNumero(listaNumeros));