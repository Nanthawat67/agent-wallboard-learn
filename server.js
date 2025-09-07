const express = require('express');
const app = express();
const PORT = 3001;

// ใช้ let เพราะต้องแก้ไข agents
let agents = [
   { code: "A001", name: "Suphichaya", status: "Available" },
   { code: "A002", name: "Bob", status: "Active" },
   { code: "A003", name: "David", status: "Wrap Up" },
   { code: "A004", name: "Alice", status: "Not Ready" },
   { code: "A005", name: "John", status: "Offline" },
   { code: "A006", name: "Emma", status: "Available" },
   { code: "A007", name: "Michael", status: "Active" },
   { code: "A008", name: "Sophia", status: "Wrap Up" },
];


// Middleware แปลง JSON request body
app.use(express.json());

// --- Agent Login ---
app.post('/api/agents/:code/login', (req, res) => {
    const agentCode = req.params.code;
    const { name } = req.body;

    let agent = agents.find(a => a.code === agentCode);

    if (!agent) {
        // สร้างใหม่ถ้าไม่มี
        agent = { code: agentCode, name: name || "Unknown", status: "Available", loginTime: new Date() };
        agents.push(agent);
    } else {
        // อัปเดต status และ loginTime
        agent.status = "Available";
        agent.loginTime = new Date();
        if (name) agent.name = name;
    }

    res.json({
        success: true,
        message: `Agent ${agentCode} logged in successfully`,
        data: agent,
        timestamp: new Date().toISOString()
    });
});

// --- Agent Logout ---
app.post('/api/agents/:code/logout', (req, res) => {
    const agentCode = req.params.code;

    const agent = agents.find(a => a.code === agentCode);
    if (!agent) {
        return res.status(404).json({
            success: false,
            error: "Agent not found"
        });
    }

    // เปลี่ยน status เป็น Offline และลบ loginTime
    agent.status = "Offline";
    delete agent.loginTime;

    res.json({
        success: true,
        message: `Agent ${agentCode} logged out successfully`,
        data: agent,
        timestamp: new Date().toISOString()
    });
});

// --- ตัวอย่าง route อื่น ๆ ---
app.get('/api/agents', (req, res) => {
    res.json({
        success: true,
        data: agents,
        count: agents.length,
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
