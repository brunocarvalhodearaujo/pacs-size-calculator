/**
 * Copyright (c) 2023-present, Bruno Carvalho de Araujo.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import { type FC, useState, useMemo } from 'react'

const modalities: string[] = [
  'CR',
  'CT',
  'DX',
  'MG',
  'MR',
  'NM',
  'US',
  'XA',
  'ECO'
]

interface CalculatorRow {
  modality: string,
  devices: number,
  studiesPerDay: number,
  usedDisk: number
}

export type Props = {}

/**
 * Calculator is described here.
 *
 * ## Usage
 * ```js
 * import * as React from 'react'
 * import Calculator from './src/Calculator.tsx'
 *
 * const MyComponent = () => (
 *   <Calculator />
 * )
 * export default MyComponent
 * ```
 */
const Calculator: FC<Props> = props => {
  const [deletedRows, setDeletedRows] = useState<boolean>(false)
  const [time, setTime] = useState<number>(20)
  const [data, setData] = useState<CalculatorRow[]>([
    { modality: 'CR', devices: 1, studiesPerDay: 82, usedDisk: 15 },
    { modality: 'CT', devices: 1, studiesPerDay: 52, usedDisk: 600 },
    { modality: 'MR', devices: 1, studiesPerDay: 14, usedDisk: 250 }
  ])

  const totalTb: number = data.reduce((acc, row): number =>
    acc + (row.studiesPerDay * row.devices * row.usedDisk * time / 1000),
    0
  )
  const bandwith: number = totalTb / time
  const sizePerYear: number = (totalTb / time) * 31

  const recommendedModel = useMemo(() => {
    if (sizePerYear <= 1000) return 'Pequena (Lite)'
    return 'Unidade Grande (Padrão)'
  }, [sizePerYear])

  const addRow = () => {
    setData([...data, { modality: '', devices: 1, studiesPerDay: 0, usedDisk: 0 }])
  }

  const rows = useMemo(() => {
    return data?.map((row, index: number) => {
      const deleteRow = () => {
        setData(data.filter((_, i) => i !== index))
        setDeletedRows(!deletedRows)
      }

      return (
        <tr key={index}>
          <td>
            <select
              className='form-control'
              value={row.modality}
              onChange={e => {
                const value = e.target.value
                const newData = [...data]
                newData[index].modality = value
                setData(newData)
              }}
            >
              <option selected value="">Selecione</option>
              {modalities.map((modality, index) => (
                <option key={index} value={modality}>
                  {modality}
                </option>
              ))}
            </select>
          </td>
          <td>
            <input
              className='form-control'
              type="number"
              value={row.devices}
              onChange={e => {
                const value = e.target.value
                const newData = [...data]
                newData[index].devices = parseInt(value, 10)
                setData(newData)
              }}
            />
          </td>
          <td>
            <input
              className='form-control'
              type="number"
              value={row.studiesPerDay}
              onChange={e => {
                const value = e.target.value
                const newData = [...data]
                newData[index].studiesPerDay = parseInt(value, 10)
                setData(newData)
              }}
            />
          </td>
          <td>
            <div className="input-group">
              <input
                className='form-control'
                type="number"
                value={row.usedDisk}
                onChange={e => {
                  const value = e.target.value
                  const newData = [...data]
                  newData[index].usedDisk = parseInt(value, 10)
                  setData(newData)
                }}
              />
              <span className="input-group-text">MB</span>
            </div>
          </td>
          <td>
            <div className="input-group">
              <input
                className='form-control'
                type="text"
                disabled
                value={row.studiesPerDay * row.devices * row.usedDisk * time / 1000}
              />
              <span className="input-group-text">GB</span>
            </div>
          </td>
          <td>
            <button
              className='btn btn-danger'
              disabled={data.length === 1}
              onClick={deleteRow}
            >
              Remover
            </button>
          </td>
        </tr>
      )
    })
  }, [data, deletedRows, time])

  return (
    <div className="container">
      <div className="row justify-content-end">
        <div className="col-md-12" style={{ marginTop: 20, marginBottom: 20 }}>
          <h1 style={{ fontWeight: 'bold', textAlign: 'center' }}>
            PACS Storage Calculator
          </h1>
        </div>
        <div className="col-md-12">
          <table className="table">
            <thead>
              <tr>
                <th>Modalidade</th>
                <th>Qtd. aparelhos</th>
                <th>Número de estudos por dia</th>
                <th>Tamanho do estudo</th>
                <th>
                  <div className="input-group">
                    <span className="input-group-text">Período</span>
                    <select
                      className='form-select form-select-sm'
                      value={time}
                      onChange={e => setTime(parseInt(e.target.value, 10))}
                    >
                      <option value="1">1 dia</option>
                      <option value="31">1 mês (31 dias)</option>
                      <option value="180">6 meses (180 dias)</option>
                      <option selected value="365">1 ano (365 dias)</option>
                      <option value="1095">3 anos (1095 dias)</option>
                      <option value="1825">5 anos (1825 dias)</option>
                    </select>
                  </div>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows}
              <tr>
                <td colSpan={3} />
                <td>
                  <b>Total sem compressão:</b>
                </td>
                <td>{Math.ceil(totalTb).toFixed(2)} GB</td>
                <td colSpan={1} />
              </tr>
              <tr>
                <td colSpan={3} />
                <td>
                  <b>Total com compressão 40%:</b>
                </td>
                <td>{(totalTb - (totalTb * (40 / 100))).toFixed(2)} GB</td>
                <td colSpan={1} />
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-md-12">
          <button className='btn btn-primary' onClick={addRow}>Adicionar</button>
        </div>
      </div>
      <div className="row" style={{ marginTop: 50 }}>
        <div className="col-md-12">
          <table className="table">
            <thead>
              <tr>
                <td>
                  <strong>Informação</strong>
                </td>
                <td>
                  <strong>Valor</strong>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tipo de unidade recomendada</td>
                <td>{recommendedModel}</td>
              </tr>
              <tr>
                <td>Tamanho de armazenamento em TB para imagens Dicom sem compressão</td>
                <td>{Math.ceil(totalTb / 1000).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Mínimo. largura de banda da rede em Mbit/s</td>
                <td>{Math.round(bandwith / 5 / 3600 * 1000 * 8).toFixed(3)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Calculator
