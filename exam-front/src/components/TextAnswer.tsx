import { useState } from "react";

export default ({ onSubmit }: { onSubmit: (answer: string) => void }) => {

    const [input, setInput] = useState<string>("");

    return (
        <>
            <textarea className="text-area full-width" rows={2} value={input}
                onChange={(e) => {
                    setInput(e.target.value)
                }} />
            <button
                className="button full-width"
                onClick={() => {
                    onSubmit(input);
                    setInput("");
                }}
            >
                Наступне питання
            </button>
        </>
    );
};