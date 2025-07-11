import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { SpreadsheetGrid } from '@/components/spreadsheet/SpreadsheetGrid'
import { QueryInput } from '@/components/copilot/QueryInput'
import { SuggestionsPanel } from '@/components/copilot/SuggestionsPanel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Settings as SettingsIcon, User } from 'lucide-react'

type ViewType = 'spreadsheet' | 'copilot' | 'settings' | 'history'

interface Suggestion {
  id: string
  type: 'formula' | 'insight' | 'action'
  title: string
  description: string
  formula?: string
  confidence: number
  category: string
}

interface HistoryItem {
  id: string
  query: string
  type: 'formula' | 'analysis' | 'cleanup'
  timestamp: Date
  result: string
}

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('spreadsheet')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [selectedCell, setSelectedCell] = useState<{id: string; value: string; row: number; col: number} | null>(null)

  const handleQuery = async (query: string, type: 'formula' | 'analysis' | 'cleanup') => {
    // Add to history
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      query,
      type,
      timestamp: new Date(),
      result: 'Processing...'
    }
    setHistory(prev => [historyItem, ...prev])

    // Simulate AI response with mock suggestions
    const mockSuggestions: Suggestion[] = [
      {
        id: Date.now().toString(),
        type: type === 'formula' ? 'formula' : 'insight',
        title: type === 'formula' ? 'SUM Formula Suggestion' : 'Data Analysis Result',
        description: type === 'formula' 
          ? 'Based on your query, this formula will calculate the sum of values'
          : 'Analysis shows trends in your selected data range',
        formula: type === 'formula' ? '=SUM(A1:A10)' : undefined,
        confidence: 0.95,
        category: type
      }
    ]

    setSuggestions(mockSuggestions)
    setCurrentView('copilot')
  }

  const handleApplySuggestion = (suggestion: Suggestion) => {
    console.log('Applying suggestion:', suggestion)
    // Here you would apply the suggestion to the spreadsheet
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'spreadsheet':
        return (
          <div className="flex h-full">
            <div className="flex-1">
              <SpreadsheetGrid onCellSelect={setSelectedCell} />
            </div>
            {selectedCell && (
              <div className="w-80 border-l border-gray-200 bg-white p-4 overflow-y-auto">
                <h3 className="font-semibold text-sm text-gray-900 mb-4">Cell Info</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Cell:</span> {selectedCell.id}
                  </div>
                  <div>
                    <span className="font-medium">Value:</span> {selectedCell.value || 'Empty'}
                  </div>
                  <div>
                    <span className="font-medium">Position:</span> Row {selectedCell.row}, Column {selectedCell.col + 1}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      
      case 'copilot':
        return (
          <div className="flex h-full">
            <div className="flex-1 p-6 overflow-y-auto">
              <QueryInput onQuery={handleQuery} />
            </div>
            <div className="w-96 border-l border-gray-200 bg-white p-6 overflow-y-auto">
              <SuggestionsPanel suggestions={suggestions} onApplySuggestion={handleApplySuggestion} />
            </div>
          </div>
        )
      
      case 'history':
        return (
          <div className="p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Query History</h2>
              
              {history.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No history yet</h3>
                    <p className="text-gray-600">Your AI Copilot queries will appear here.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <Card key={item.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{item.query}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{item.type}</Badge>
                            <span className="text-xs text-gray-500">
                              {item.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{item.result}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      
      case 'settings':
        return (
          <div className="p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      User Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Language</label>
                      <select className="w-full mt-1 p-2 border border-gray-300 rounded-md">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <SettingsIcon className="h-5 w-5" />
                      AI Copilot Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-suggest formulas</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Show confidence scores</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Enable voice commands</span>
                      <input type="checkbox" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="h-screen bg-excel-background flex flex-col">
      <Header 
        onViewChange={setCurrentView}
        currentView={currentView}
      />
      <main className="flex-1 overflow-hidden">
        {renderCurrentView()}
      </main>
    </div>
  )
}

export default App