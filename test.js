const history = [
    { role: "agent", content: "hello" },
    { role: "user", content: "hi" },
    { role: "agent", content: "how are you" },
    { role: "agent", content: "tell me more" },
    { role: "user", content: "i am good" }
];
const modelHistory = [...history, { role: "user", content: "what's up" }]
    .slice(-14)
    .map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: String(m.content || "").trim() || `[${m.type || "message"}]` }]
    }));

console.log(JSON.stringify(modelHistory, null, 2));

let validHistory = [];
for (const h of modelHistory.slice(0, -1)) {
    const role = h.role;
    const last = validHistory[validHistory.length - 1];
    if (last && last.role === role) {
        last.parts[0].text += "\n" + h.parts[0].text;
    } else {
        validHistory.push({ role, parts: [{ text: h.parts[0].text }] });
    }
}
if (validHistory.length > 0 && validHistory[0].role !== "user") {
    validHistory.shift();
}
console.log(JSON.stringify(validHistory, null, 2));
