import React, { useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import ReactMarkdown from "react-markdown";
import "easymde/dist/easymde.min.css";
import { Button } from "@mui/material";

export const MarkdownEditor = ({ onSubmit }: { onSubmit: (value: any) => void }) => {
    const [markdown, setMarkdown] = useState("");

    const handleMarkdownChange = (value: any) => {
        setMarkdown(value);
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        onSubmit(markdown)
        setMarkdown("");
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                padding: "20px",
            }}
        >
            <form onSubmit={handleSubmit}>
                <SimpleMDE
                    value={markdown}
                    onChange={handleMarkdownChange}
                    options={{
                        autofocus: true,
                        spellChecker: false,
                        placeholder: "Type your markdown here...",
                    }}
                />
                {/* <div>
          <h2>Preview</h2>
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div> */}
                <Button variant="contained" type="submit">Submit</Button>
            </form>
        </div>
    );
};

export default MarkdownEditor;
