import { Bot, Settings, History, FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  onViewChange: (view: 'spreadsheet' | 'copilot' | 'settings' | 'history') => void
  currentView: string
}

export function Header({ onViewChange, currentView }: HeaderProps) {
  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="h-6 w-6 text-excel-green" />
          <h1 className="text-xl font-semibold text-gray-900">Excel AI Copilot</h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant={currentView === 'spreadsheet' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange('spreadsheet')}
          className="text-sm"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Spreadsheet
        </Button>
        
        <Button
          variant={currentView === 'copilot' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange('copilot')}
          className="text-sm bg-excel-green hover:bg-excel-green-light text-white"
        >
          <Bot className="h-4 w-4 mr-2" />
          AI Copilot
        </Button>
        
        <Button
          variant={currentView === 'history' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange('history')}
          className="text-sm"
        >
          <History className="h-4 w-4 mr-2" />
          History
        </Button>
        
        <Button
          variant={currentView === 'settings' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange('settings')}
          className="text-sm"
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </header>
  )
}