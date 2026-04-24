type Props = {
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  onTyping: () => void;
};

export default function InputBar({ input, setInput, onSend, onTyping }: Props) {
  return (
    <div className="px-3 md:px-5 py-3 md:py-4 bg-gray-900 border-t border-gray-800 flex gap-2 md:gap-3">
      <input
        className="flex-1 bg-gray-800 rounded-xl px-3 md:px-4 py-2 md:py-3 text-sm outline-none placeholder-gray-500 text-white"
        placeholder="Type a message... (@ai to ask AI)"
        value={input}
        onChange={e => { setInput(e.target.value); onTyping(); }}
        onKeyDown={e => e.key === "Enter" && onSend()}
      />
      <button
        onClick={onSend}
        className="bg-purple-600 hover:bg-purple-700 px-4 md:px-5 rounded-xl text-sm font-bold transition text-white flex-shrink-0"
      >
        Send
      </button>
    </div>
  );
}