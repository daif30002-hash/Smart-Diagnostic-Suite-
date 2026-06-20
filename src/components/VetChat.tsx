import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, RefreshCw, AlertCircle, Bot, User, Trash2, ShieldAlert } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const PRESET_QUERIES = [
  { text: "القطعان تعاني من سعال وحشرجة مع إسهال مائي مخضر. ما التحرك الإسعافي؟" },
  { text: "اقترح برنامجاً وقائياً وتلقيحياً ضد مرض الجمبورو (IBD) في التسمين." },
  { text: "اشرح الفارق الباثولوجي والتشريحي بصفة الطيور بين الكولاي والـ CRD." },
  { text: "رطوبة النشارة والفرشة تجاوزت الحد الآمن. كيف نضبط الجفاف لمنع الكوكسيديا؟" }
];

export default function VetChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: "initial-msg",
        role: "assistant",
        content: "مرحباً بك في العيادة البيطرية التفاعلية للقطعان! أنا مرشدك الرقمي المساعد المدعوم بالذكاء الاصطناعي المتخصص لمزارع أمهات وتسمين دجاج اللحم. اطرح علي أي تساؤل بخصوص الأعراض المرضية، الصفات التشريحية للأعضاء، مكافحة الأوبئة، برامج التحصين والتلقيحات، أو آليات معالجة هواء وحرارة العنابر."
      }
    ];
  });
  const [inputValue, setInputValue] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Auto scroll messages
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSend = async (textToSend: string) => {
    const rawText = textToSend.trim();
    if (!rawText) return;

    setErrorMsg(null);
    setInputValue('');
    
    // 1. Add user message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: rawText
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsSending(true);

    try {
      // 2. Fetch server-side `/api/gemini/chat`
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }))
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "عذراً، تعذر الاتصال بالنواة البيطرية الذكية.");
      }

      // 3. Add AI response message
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "عذرًا، لم أستطع صياغة إجابة مناسبة حالياً. هل يمكنك إعادة صياغة تساؤلك الفني مطلعاً؟"
      };

      setMessages(p => [...p, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "فشل الاتصال بالخادم الرئيسي. يرجى التحقق من توفر مفتاح Gemini API.");
    } finally {
      setIsSending(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: "initial-msg",
        role: "assistant",
        content: "مرحباً بك في العيادة البيطرية التفاعلية للقطعان! أنا مرشدك الرقمي المساعد المدعوم بالذكاء الاصطناعي المتخصص لمزارع أمهات وتسمين دجاج اللحم. اطرح علي أي تساؤل بخصوص الأعراض المرضية، الصفات التشريحية للأعضاء، مكافحة الأوبئة، برامج التحصين والتلقيحات، أو آليات معالجة هواء وحرارة العنابر."
      }
    ]);
    setInputValue('');
    setErrorMsg(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[560px] text-right" id="avian-vet-chatbot" dir="rtl">
      
      {/* Chat header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center gap-2 justify-start">
          <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600">
            <Bot className="w-5 h-5 animate-pulse" />
          </span>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">مستشار واستشاري العيادة التفاعلية</h4>
            <span className="text-[10px] text-emerald-700 font-bold block leading-none select-none text-right">مدعوم بذكاء جيمي المتقدم الأصيل</span>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition hover:bg-red-50 cursor-pointer"
          title="مسح سجل المحادثة"
          aria-label="مسح سجل المحادثة"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages content panel */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isAI = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${isAI ? 'ml-auto text-right flex-row' : 'mr-auto text-left flex-row-reverse'}`}
            >
              {/* Avatar indicator */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                isAI ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-600'
               }`}>
                {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message bubble card */}
              <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed text-right ${
                isAI 
                  ? 'bg-neutral-50/70 border-slate-100 text-slate-800 rounded-tr-sm' 
                  : 'bg-[#027E74] border-[#027E74] text-white rounded-tl-sm'
              }`}>
                {/* Parse newline split for comfortable markdown reading */}
                {msg.content.split('\n').map((line, i) => {
                  // Clean list rendering inside speech bubbles
                  if (line.startsWith('- ') || line.startsWith('* ')) {
                    return (
                      <div key={i} className="flex gap-1.5 text-xs text-slate-800 py-0.5 leading-relaxed justify-start text-right">
                        <span className="text-emerald-600 font-bold shrink-0">&bull;</span>
                        <span>{line.substring(2)}</span>
                      </div>
                    );
                  }
                  return <p key={i} className={i > 0 ? 'mt-1.5 block' : 'block'}>{line}</p>;
                })}
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex gap-3 max-w-[85%] ml-auto text-right">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 animate-bounce">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl border border-slate-100 bg-neutral-50/50 text-slate-500 text-xs flex items-center gap-2 font-sans text-right justify-start">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#027E74]" />
              <span>الطبيب المساعد يقوم بصياغة المذكرة والعلاج...</span>
            </div>
          </div>
        )}

        <div ref={endOfMessagesRef} />
      </div>

      {/* Seed Questions box */}
      {messages.length === 1 && (
        <div className="p-4 border-t border-slate-50 bg-slate-50/30">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-2 text-right">اختر أحد محاور الاستشارة والعيادة الفورية:</span>
          <div className="flex flex-wrap gap-2 justify-start">
            {PRESET_QUERIES.map((preset, index) => (
              <button
                key={index}
                onClick={() => handleSend(preset.text)}
                className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 text-[11px] text-slate-600 hover:text-emerald-900 rounded-xl transition text-right cursor-pointer font-medium"
              >
                {preset.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input container */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
        
        {errorMsg && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-2.5 flex items-start gap-2 text-xs text-red-800 leading-normal text-right justify-start">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
          className="flex items-stretch gap-2.5"
        >
          <button
            type="submit"
            disabled={isSending || !inputValue.trim()}
            className="px-4 bg-[#027E74] hover:bg-[#006A62] text-white rounded-xl flex items-center justify-center transition shadow-xs cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-[#027E74]"
          >
            <Send className="w-4 h-4 -scale-x-100" />
          </button>
          <input
            type="text"
            id="vet-chat-user-textbox"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isSending}
            placeholder="اكتب استشارتك الفنية البيطرية للقطيع أو اللقاحات أو جودة الهواء هنا..."
            className="flex-grow px-4 py-3 border border-slate-200 rounded-xl bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#027E74] text-right"
            dir="rtl"
          />
        </form>

        <span className="text-[10px] text-slate-400 leading-none block text-center font-medium">
          💡 يمكنك رصد مستويات الأمان الحيوي المتكاملة وتوليد تقرير الترجيح البيطري بالتبويبات الأخرى.
        </span>
      </div>

    </div>
  );
}
