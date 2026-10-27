const ChatHeader = () => {
  return (
    <div className="px-6 py-4 border-b border-roti-cream/20 bg-roti-cream flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
          <span className="text-xl font-bold text-roti-primary">A</span>
        </div>
        <div>
          <h3 className="font-semibold text-roti-dark">RotiAI (Gemini + LangChain)</h3>
          <p className="text-xs text-roti-cream/50">Conectado con el contexto de la web</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-roti-success"></span>
        </span>
        <span className="text-sm font-medium text-roti-success">En línea</span>
      </div>
    </div>
  );
};

export default ChatHeader;
