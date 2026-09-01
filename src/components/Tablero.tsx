import { useState } from 'react'
import type { KeyboardEvent } from 'react'

const TAMANO = 8

const filas = Array(TAMANO).fill(null)
const columnas = Array(TAMANO).fill(null)

interface Posicion {
  fila: number
  columna: number
}

function Tablero() {
  const [serpiente, setSerpiente] = useState<Posicion[]>([
    { fila: 3, columna: 3 },
    { fila: 3, columna: 2 },
    { fila: 3, columna: 1 }
  ])

  const [comida, setComida] = useState<Posicion>({
    fila: 1,
    columna: 5
  })

  const [juegoTerminado, setJuegoTerminado] =
    useState<boolean>(false)

  const generarComida = (
    serpienteActual: Posicion[]
  ): Posicion => {
    const celdasLibres: Posicion[] = []

    const posicionesOcupadas = serpienteActual.map(
      (segmento) => {
        return segmento.fila + '-' + segmento.columna
      }
    )

    filas.forEach((_, fila) => {
      columnas.forEach((_, columna) => {
        const posicion = fila + '-' + columna

        if (!posicionesOcupadas.includes(posicion)) {
          celdasLibres.push({
            fila: fila,
            columna: columna
          })
        }
      })
    })

    const indiceAleatorio = Math.floor(
      Math.random() * celdasLibres.length
    )

    return celdasLibres[indiceAleatorio]
  }

  const manejarTecla = (
    evento: KeyboardEvent<HTMLDivElement>
  ): void => {
    if (juegoTerminado) {
      return
    }

    let cambioFila = 0
    let cambioColumna = 0

    if (evento.key === 'ArrowUp') {
      cambioFila = -1
    } else if (evento.key === 'ArrowDown') {
      cambioFila = 1
    } else if (evento.key === 'ArrowLeft') {
      cambioColumna = -1
    } else if (evento.key === 'ArrowRight') {
      cambioColumna = 1
    } else {
      return
    }

    const cabezaActual = serpiente[0]

    const nuevaCabeza: Posicion = {
      fila: cabezaActual.fila + cambioFila,
      columna: cabezaActual.columna + cambioColumna
    }

    const comio =
      nuevaCabeza.fila === comida.fila &&
      nuevaCabeza.columna === comida.columna

    const salioDelTablero =
      nuevaCabeza.fila < 0 ||
      nuevaCabeza.fila >= TAMANO ||
      nuevaCabeza.columna < 0 ||
      nuevaCabeza.columna >= TAMANO

    let cuerpoParaColision = serpiente

    if (!comio) {
      cuerpoParaColision = serpiente.slice(0, -1)
    }

    const posicionesParaColision =
      cuerpoParaColision.map((segmento) => {
        return segmento.fila + '-' + segmento.columna
      })

    const posicionNuevaCabeza =
      nuevaCabeza.fila + '-' + nuevaCabeza.columna

    const chocoConCuerpo =
      posicionesParaColision.includes(posicionNuevaCabeza)

    if (salioDelTablero || chocoConCuerpo) {
      setJuegoTerminado(true)
      return
    }

    const nuevaSerpiente: Posicion[] = serpiente.map(
      (_, indice) => {
        if (indice === 0) {
          return nuevaCabeza
        }

        return serpiente[indice - 1]
      }
    )

    if (comio) {
      const ultimoSegmento =
        serpiente[serpiente.length - 1]

      nuevaSerpiente.push(ultimoSegmento)

      const nuevaComida = generarComida(nuevaSerpiente)
      setComida(nuevaComida)
    }

    setSerpiente(nuevaSerpiente)
  }

  const cuerpo = serpiente.slice(1)

  const posicionesCuerpo = cuerpo.map((segmento) => {
    return segmento.fila + '-' + segmento.columna
  })

  return (
    <div
      className={
        juegoTerminado
          ? 'juego terminado'
          : 'juego'
      }
      tabIndex={0}
      onKeyDown={manejarTecla}
    >
      <p>Haz clic en el tablero y utiliza las flechas</p>

      {juegoTerminado && (
        <h2 className="mensaje-final">
          Juego terminado
        </h2>
      )}

      <table>
        <tbody>
          {filas.map((_, fila) => {
            return (
              <tr key={fila}>
                {columnas.map((_, columna) => {
                  const posicionCelda =
                    fila + '-' + columna

                  const esCabeza =
                    serpiente[0].fila === fila &&
                    serpiente[0].columna === columna

                  const esCuerpo =
                    posicionesCuerpo.includes(posicionCelda)

                  const esComida =
                    comida.fila === fila &&
                    comida.columna === columna

                  let claseCelda = ''

                  if (esCabeza) {
                    claseCelda = 'cabeza'
                  } else if (esCuerpo) {
                    claseCelda = 'cuerpo'
                  } else if (esComida) {
                    claseCelda = 'comida'
                  }

                  return (
                    <td
                      key={posicionCelda}
                      className={claseCelda}
                    ></td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Tablero