
import React from 'react';
import Header from './components/Header.tsx';
import Chat from './components/Chat.tsx';

function App() {
  return (
    <div className="min-h-screen bg-[#121212] text-slate-300 flex flex-col md:flex-row">
      <Header />
      <main className="flex-1 flex flex-col h-screen md:h-auto">
        <Chat />
      </main>
    </div>
  );
}

export default App;
