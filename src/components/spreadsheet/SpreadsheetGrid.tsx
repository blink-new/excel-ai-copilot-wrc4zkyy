import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'

interface Cell {
  id: string
  value: string
  formula?: string
  row: number
  col: number
}

interface SpreadsheetGridProps {
  onCellSelect?: (cell: Cell) => void
}

const COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']
const ROWS = 20

export function SpreadsheetGrid({ onCellSelect }: SpreadsheetGridProps) {
  const [cells, setCells] = useState<Cell[]>(() => {
    const initialCells: Cell[] = []
    for (let row = 1; row <= ROWS; row++) {
      for (let col = 0; col < COLUMNS.length; col++) {
        initialCells.push({
          id: `${COLUMNS[col]}${row}`,
          value: '',
          row,
          col
        })
      }
    }
    return initialCells
  })
  
  const [selectedCell, setSelectedCell] = useState<string>('A1')
  const [formulaBarValue, setFormulaBarValue] = useState('')

  const getCellValue = useCallback((row: number, col: number) => {
    const cell = cells.find(c => c.row === row && c.col === col)
    return cell?.value || ''
  }, [cells])

  const updateCell = useCallback((cellId: string, value: string) => {
    setCells(prev => prev.map(cell => 
      cell.id === cellId ? { ...cell, value } : cell
    ))
    
    // Update formula bar
    const cell = cells.find(c => c.id === cellId)
    if (cell) {
      setFormulaBarValue(value)
      onCellSelect?.(cell)
    }
  }, [cells, onCellSelect])

  const handleCellClick = (cellId: string) => {
    setSelectedCell(cellId)
    const cell = cells.find(c => c.id === cellId)
    if (cell) {
      setFormulaBarValue(cell.value)
      onCellSelect?.(cell)
    }
  }

  const handleFormulaBarChange = (value: string) => {
    setFormulaBarValue(value)
    updateCell(selectedCell, value)
  }

  return (
    <div className="flex flex-col h-full bg-excel-background">
      {/* Formula Bar */}
      <div className="bg-white border-b border-gray-200 p-3 flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">Name Box:</span>
          <div className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm font-mono min-w-[60px] text-center">
            {selectedCell}
          </div>
        </div>
        <div className="flex-1 flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">fx</span>
          <Input
            value={formulaBarValue}
            onChange={(e) => handleFormulaBarChange(e.target.value)}
            placeholder="Enter formula or value..."
            className="flex-1 font-mono text-sm"
          />
        </div>
      </div>

      {/* Spreadsheet Grid */}
      <div className="flex-1 overflow-auto">
        <div className="inline-block min-w-full">
          <table className="border-collapse bg-white">
            <thead>
              <tr>
                <th className="w-12 h-8 border border-gray-300 bg-gray-100 text-xs font-medium text-gray-600"></th>
                {COLUMNS.map(col => (
                  <th key={col} className="w-24 h-8 border border-gray-300 bg-gray-100 text-xs font-medium text-gray-700 text-center">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: ROWS }, (_, rowIndex) => {
                const row = rowIndex + 1
                return (
                  <tr key={row}>
                    <td className="w-12 h-8 border border-gray-300 bg-gray-100 text-xs font-medium text-gray-600 text-center">
                      {row}
                    </td>
                    {COLUMNS.map((col, colIndex) => {
                      const cellId = `${col}${row}`
                      const cellValue = getCellValue(row, colIndex)
                      const isSelected = selectedCell === cellId
                      
                      return (
                        <td key={cellId} className="w-24 h-8 border border-gray-300 p-0">
                          <input
                            type="text"
                            value={cellValue}
                            onChange={(e) => updateCell(cellId, e.target.value)}
                            onClick={() => handleCellClick(cellId)}
                            className={`w-full h-full px-1 text-xs border-none outline-none focus:outline-none ${
                              isSelected 
                                ? 'bg-blue-50 ring-2 ring-blue-500 ring-inset' 
                                : 'bg-transparent hover:bg-gray-50'
                            }`}
                          />
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Row/Column Controls */}
      <div className="bg-white border-t border-gray-200 p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" className="text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Add Row
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Add Column
          </Button>
        </div>
        <div className="text-xs text-gray-500">
          Sheet1 | {cells.filter(c => c.value).length} cells with data
        </div>
      </div>
    </div>
  )
}