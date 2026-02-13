"use client";

import { useEffect, useState, useCallback } from "react";

interface Message {
    id: string;
    name: string;
    telegram: string;
    projectType: string;
    budget: string;
    description: string;
    status: string;
    createdAt: string;
    notes: string;
}

const STATUS_OPTIONS = [
    { value: "new", label: "Новый", color: "#3b82f6" },
    { value: "in_progress", label: "В работе", color: "#f59e0b" },
    { value: "replied", label: "Ответил", color: "#22c55e" },
    { value: "closed", label: "Закрыт", color: "#6b7280" },
];

function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getStatusInfo(status: string) {
    return STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
}

export default function AdminPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [selected, setSelected] = useState<Message | null>(null);
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    const fetchMessages = useCallback(async () => {
        try {
            const res = await fetch("/api/contact");
            const data = await res.json();
            setMessages(data);
        } catch {
            console.error("Failed to fetch messages");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const updateStatus = async (id: string, status: string) => {
        await fetch(`/api/contact/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        fetchMessages();
        if (selected?.id === id) setSelected((prev) => (prev ? { ...prev, status } : null));
    };

    const saveNotes = async (id: string) => {
        await fetch(`/api/contact/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notes }),
        });
        fetchMessages();
    };

    const deleteMessage = async (id: string) => {
        if (!confirm("Удалить заявку?")) return;
        await fetch(`/api/contact/${id}`, { method: "DELETE" });
        if (selected?.id === id) setSelected(null);
        fetchMessages();
    };

    const filtered = filter === "all" ? messages : messages.filter((m) => m.status === filter);

    const stats = {
        total: messages.length,
        new: messages.filter((m) => m.status === "new").length,
        inProgress: messages.filter((m) => m.status === "in_progress").length,
        replied: messages.filter((m) => m.status === "replied").length,
    };

    return (
        <div style={{ minHeight: "100vh", background: "#0A0A0F", color: "#E8E8E8", fontFamily: "system-ui, -apple-system, sans-serif" }}>
            {/* Top Bar */}
            <header
                style={{
                    background: "rgba(15, 15, 25, 0.95)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    padding: "16px 32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backdropFilter: "blur(12px)",
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <a href="/" style={{ color: "#FF4D00", textDecoration: "none", fontWeight: 700, fontSize: "20px" }}>
                        ← DT
                    </a>
                    <h1 style={{ fontSize: "18px", fontWeight: 600, color: "#E8E8E8" }}>Admin CRM</h1>
                </div>
                <div style={{ display: "flex", gap: "24px", fontSize: "13px" }}>
                    <span>Всего: <b style={{ color: "#E8E8E8" }}>{stats.total}</b></span>
                    <span>Новых: <b style={{ color: "#3b82f6" }}>{stats.new}</b></span>
                    <span>В работе: <b style={{ color: "#f59e0b" }}>{stats.inProgress}</b></span>
                    <span>Ответил: <b style={{ color: "#22c55e" }}>{stats.replied}</b></span>
                </div>
            </header>

            <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
                {/* Sidebar — message list */}
                <div
                    style={{
                        width: "420px",
                        minWidth: "420px",
                        borderRight: "1px solid rgba(255,255,255,0.06)",
                        overflow: "auto",
                        background: "rgba(12, 12, 20, 0.8)",
                    }}
                >
                    {/* Filters */}
                    <div style={{ padding: "16px", display: "flex", gap: "8px", flexWrap: "wrap", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <FilterBtn active={filter === "all"} onClick={() => setFilter("all")} label={`Все (${stats.total})`} />
                        {STATUS_OPTIONS.map((s) => (
                            <FilterBtn
                                key={s.value}
                                active={filter === s.value}
                                onClick={() => setFilter(s.value)}
                                label={s.label}
                                dotColor={s.color}
                            />
                        ))}
                    </div>

                    {loading ? (
                        <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>Загрузка...</div>
                    ) : filtered.length === 0 ? (
                        <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>Нет заявок</div>
                    ) : (
                        filtered.map((msg) => {
                            const si = getStatusInfo(msg.status);
                            const isActive = selected?.id === msg.id;
                            return (
                                <div
                                    key={msg.id}
                                    onClick={() => {
                                        setSelected(msg);
                                        setNotes(msg.notes || "");
                                    }}
                                    style={{
                                        padding: "16px 20px",
                                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                                        cursor: "pointer",
                                        background: isActive ? "rgba(255, 77, 0, 0.06)" : "transparent",
                                        borderLeft: isActive ? "3px solid #FF4D00" : "3px solid transparent",
                                        transition: "all 0.15s",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) e.currentTarget.style.background = "transparent";
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                        <span style={{ fontWeight: 600, fontSize: "15px" }}>{msg.name}</span>
                                        <span
                                            style={{
                                                fontSize: "11px",
                                                padding: "3px 10px",
                                                borderRadius: "20px",
                                                background: si.color + "20",
                                                color: si.color,
                                                fontWeight: 500,
                                            }}
                                        >
                                            {si.label}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: "13px", color: "#888", marginBottom: "4px" }}>{msg.telegram}</div>
                                    <div style={{ fontSize: "13px", color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {msg.description}
                                    </div>
                                    <div style={{ fontSize: "11px", color: "#555", marginTop: "6px" }}>{formatDate(msg.createdAt)}</div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Main — message detail */}
                <div style={{ flex: 1, overflow: "auto", padding: "32px" }}>
                    {!selected ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#555" }}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                            <p style={{ marginTop: "16px", fontSize: "15px" }}>Выберите заявку из списка</p>
                        </div>
                    ) : (
                        <div style={{ maxWidth: "800px" }}>
                            {/* Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
                                <div>
                                    <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "4px" }}>{selected.name}</h2>
                                    <p style={{ fontSize: "13px", color: "#666" }}>{formatDate(selected.createdAt)}</p>
                                </div>
                                <button
                                    onClick={() => deleteMessage(selected.id)}
                                    style={{
                                        background: "rgba(239, 68, 68, 0.1)",
                                        border: "1px solid rgba(239, 68, 68, 0.2)",
                                        color: "#ef4444",
                                        padding: "8px 16px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontSize: "13px",
                                    }}
                                >
                                    Удалить
                                </button>
                            </div>

                            {/* Info grid */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                    gap: "16px",
                                    marginBottom: "32px",
                                }}
                            >
                                <InfoCard
                                    label="Telegram"
                                    value={selected.telegram}
                                    link={`https://t.me/${selected.telegram.replace("@", "")}`}
                                />
                                <InfoCard label="Тип проекта" value={selected.projectType} />
                                <InfoCard label="Бюджет" value={selected.budget} />
                                <div>
                                    <span style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "8px" }}>Статус</span>
                                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                        {STATUS_OPTIONS.map((s) => (
                                            <button
                                                key={s.value}
                                                onClick={() => updateStatus(selected.id, s.value)}
                                                style={{
                                                    padding: "6px 14px",
                                                    borderRadius: "8px",
                                                    fontSize: "12px",
                                                    fontWeight: 500,
                                                    border: selected.status === s.value ? `1px solid ${s.color}` : "1px solid rgba(255,255,255,0.08)",
                                                    background: selected.status === s.value ? s.color + "20" : "rgba(255,255,255,0.03)",
                                                    color: selected.status === s.value ? s.color : "#888",
                                                    cursor: "pointer",
                                                    transition: "all 0.15s",
                                                }}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div
                                style={{
                                    background: "rgba(255,255,255,0.02)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: "12px",
                                    padding: "24px",
                                    marginBottom: "24px",
                                }}
                            >
                                <span style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "12px" }}>Описание проекта</span>
                                <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#ccc", whiteSpace: "pre-wrap" }}>
                                    {selected.description}
                                </p>
                            </div>

                            {/* Notes */}
                            <div
                                style={{
                                    background: "rgba(255,255,255,0.02)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: "12px",
                                    padding: "24px",
                                    marginBottom: "24px",
                                }}
                            >
                                <span style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "12px" }}>Мои заметки</span>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Добавить заметку..."
                                    rows={4}
                                    style={{
                                        width: "100%",
                                        background: "rgba(255,255,255,0.02)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        borderRadius: "8px",
                                        padding: "12px 16px",
                                        color: "#E8E8E8",
                                        fontSize: "14px",
                                        resize: "vertical",
                                        outline: "none",
                                        fontFamily: "inherit",
                                    }}
                                />
                                <button
                                    onClick={() => saveNotes(selected.id)}
                                    style={{
                                        marginTop: "12px",
                                        padding: "10px 24px",
                                        borderRadius: "8px",
                                        background: "#FF4D00",
                                        color: "#fff",
                                        border: "none",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                    }}
                                >
                                    Сохранить заметку
                                </button>
                            </div>

                            {/* Quick action — open in TG */}
                            <a
                                href={`https://t.me/${selected.telegram.replace("@", "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "14px 28px",
                                    borderRadius: "12px",
                                    background: "linear-gradient(135deg, #0088cc 0%, #0066aa 100%)",
                                    color: "#fff",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                    transition: "transform 0.15s",
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                </svg>
                                Написать в Telegram
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function InfoCard({ label, value, link }: { label: string; value: string; link?: string }) {
    return (
        <div
            style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px",
                padding: "16px 20px",
            }}
        >
            <span style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "6px" }}>{label}</span>
            {link ? (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#FF4D00", fontWeight: 600, fontSize: "15px", textDecoration: "none" }}
                >
                    {value}
                </a>
            ) : (
                <span style={{ fontWeight: 600, fontSize: "15px" }}>{value}</span>
            )}
        </div>
    );
}

function FilterBtn({
    active,
    onClick,
    label,
    dotColor,
}: {
    active: boolean;
    onClick: () => void;
    label: string;
    dotColor?: string;
}) {
    return (
        <button
            onClick={onClick}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 500,
                border: active ? "1px solid rgba(255, 77, 0, 0.3)" : "1px solid rgba(255,255,255,0.08)",
                background: active ? "rgba(255, 77, 0, 0.1)" : "rgba(255,255,255,0.03)",
                color: active ? "#FF4D00" : "#888",
                cursor: "pointer",
                transition: "all 0.15s",
            }}
        >
            {dotColor && (
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: dotColor }} />
            )}
            {label}
        </button>
    );
}
