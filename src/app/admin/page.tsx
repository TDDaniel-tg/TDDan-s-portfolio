"use client";

import { useEffect, useState, useCallback } from "react";

/* ─── TYPES ─── */
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

interface Project {
    id: string;
    titleEn: string;
    titleRu: string;
    descEn: string;
    descRu: string;
    detailsEn: string;
    detailsRu: string;
    tags: string[];
    price: string;
    imageUrl: string;
    link: string;
    visible: boolean;
    order: number;
}

interface Settings {
    showProjects: boolean;
}

/* ─── CONSTANTS ─── */
const STATUS_OPTIONS = [
    { value: "new", label: "Новый", color: "#3b82f6" },
    { value: "in_progress", label: "В работе", color: "#f59e0b" },
    { value: "replied", label: "Ответил", color: "#22c55e" },
    { value: "closed", label: "Закрыт", color: "#6b7280" },
];

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("ru-RU", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

function getStatusInfo(status: string) {
    return STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
}

/* ─── SHARED STYLES ─── */
const cardBg = "rgba(255,255,255,0.02)";
const cardBorder = "1px solid rgba(255,255,255,0.06)";
const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#E8E8E8",
    fontSize: "13px",
    outline: "none",
    fontFamily: "inherit",
};

/* ─── MAIN ─── */
export default function AdminPage() {
    const [tab, setTab] = useState<"messages" | "projects" | "settings">("messages");

    return (
        <div style={{ minHeight: "100vh", background: "#0A0A0F", color: "#E8E8E8", fontFamily: "system-ui, -apple-system, sans-serif" }}>
            {/* Top Bar */}
            <header
                style={{
                    background: "rgba(15, 15, 25, 0.95)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    padding: "0 32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backdropFilter: "blur(12px)",
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                    height: "56px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                    <a href="/" style={{ color: "#FF4D00", textDecoration: "none", fontWeight: 700, fontSize: "20px" }}>
                        ← DT
                    </a>
                    <h1 style={{ fontSize: "16px", fontWeight: 600 }}>Admin Panel</h1>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: "4px" }}>
                    {(["messages", "projects", "settings"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            style={{
                                padding: "8px 20px",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: 500,
                                border: "none",
                                cursor: "pointer",
                                background: tab === t ? "rgba(255, 77, 0, 0.12)" : "transparent",
                                color: tab === t ? "#FF4D00" : "#888",
                                transition: "all 0.15s",
                            }}
                        >
                            {t === "messages" ? "📩 Заявки" : t === "projects" ? "📁 Проекты" : "⚙️ Настройки"}
                        </button>
                    ))}
                </div>
            </header>

            {/* Content */}
            {tab === "messages" && <MessagesTab />}
            {tab === "projects" && <ProjectsTab />}
            {tab === "settings" && <SettingsTab />}
        </div>
    );
}

/* ───────────────────────────────────── */
/* ─── MESSAGES TAB ─── */
/* ───────────────────────────────────── */
function MessagesTab() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [selected, setSelected] = useState<Message | null>(null);
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    const fetchMessages = useCallback(async () => {
        try {
            const res = await fetch("/api/contact");
            setMessages(await res.json());
        } catch { } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchMessages(); }, [fetchMessages]);

    const updateStatus = async (id: string, status: string) => {
        await fetch(`/api/contact/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
        fetchMessages();
        if (selected?.id === id) setSelected((p) => (p ? { ...p, status } : null));
    };

    const saveNotes = async (id: string) => {
        await fetch(`/api/contact/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notes }) });
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
        <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
            {/* Sidebar */}
            <div style={{ width: "420px", minWidth: "360px", borderRight: cardBorder, overflow: "auto", background: "rgba(12, 12, 20, 0.8)" }}>
                {/* Stats row */}
                <div style={{ padding: "12px 16px", display: "flex", gap: "16px", fontSize: "12px", borderBottom: cardBorder, color: "#888" }}>
                    <span>Всего: <b style={{ color: "#E8E8E8" }}>{stats.total}</b></span>
                    <span>Новых: <b style={{ color: "#3b82f6" }}>{stats.new}</b></span>
                    <span>В работе: <b style={{ color: "#f59e0b" }}>{stats.inProgress}</b></span>
                    <span>Ответил: <b style={{ color: "#22c55e" }}>{stats.replied}</b></span>
                </div>
                {/* Filters */}
                <div style={{ padding: "12px 16px", display: "flex", gap: "6px", flexWrap: "wrap", borderBottom: cardBorder }}>
                    <FilterBtn active={filter === "all"} onClick={() => setFilter("all")} label={`Все`} />
                    {STATUS_OPTIONS.map((s) => (
                        <FilterBtn key={s.value} active={filter === s.value} onClick={() => setFilter(s.value)} label={s.label} dotColor={s.color} />
                    ))}
                </div>

                {loading ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "#555" }}>Загрузка...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "#555" }}>Нет заявок</div>
                ) : (
                    filtered.map((msg) => {
                        const si = getStatusInfo(msg.status);
                        const active = selected?.id === msg.id;
                        return (
                            <div
                                key={msg.id}
                                onClick={() => { setSelected(msg); setNotes(msg.notes || ""); }}
                                style={{
                                    padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.03)", cursor: "pointer",
                                    background: active ? "rgba(255, 77, 0, 0.06)" : "transparent",
                                    borderLeft: active ? "3px solid #FF4D00" : "3px solid transparent",
                                }}
                                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                    <span style={{ fontWeight: 600, fontSize: "14px" }}>{msg.name}</span>
                                    <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "20px", background: si.color + "20", color: si.color, fontWeight: 500 }}>
                                        {si.label}
                                    </span>
                                </div>
                                <div style={{ fontSize: "12px", color: "#888", marginBottom: "3px" }}>{msg.telegram}</div>
                                <div style={{ fontSize: "12px", color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.description}</div>
                                <div style={{ fontSize: "10px", color: "#444", marginTop: "4px" }}>{formatDate(msg.createdAt)}</div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Detail */}
            <div style={{ flex: 1, overflow: "auto", padding: "28px" }}>
                {!selected ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#444" }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                        <p style={{ marginTop: "12px", fontSize: "14px" }}>Выберите заявку</p>
                    </div>
                ) : (
                    <div style={{ maxWidth: "760px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                            <div>
                                <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "2px" }}>{selected.name}</h2>
                                <p style={{ fontSize: "12px", color: "#555" }}>{formatDate(selected.createdAt)}</p>
                            </div>
                            <button onClick={() => deleteMessage(selected.id)} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>
                                Удалить
                            </button>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "24px" }}>
                            <InfoCard label="Telegram" value={selected.telegram} link={`https://t.me/${selected.telegram.replace("@", "")}`} />
                            <InfoCard label="Тип проекта" value={selected.projectType} />
                            <InfoCard label="Бюджет" value={selected.budget} />
                            <div>
                                <span style={{ fontSize: "11px", color: "#555", display: "block", marginBottom: "6px" }}>Статус</span>
                                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                                    {STATUS_OPTIONS.map((s) => (
                                        <button key={s.value} onClick={() => updateStatus(selected.id, s.value)} style={{
                                            padding: "5px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: 500, cursor: "pointer",
                                            border: selected.status === s.value ? `1px solid ${s.color}` : "1px solid rgba(255,255,255,0.06)",
                                            background: selected.status === s.value ? s.color + "20" : "rgba(255,255,255,0.02)",
                                            color: selected.status === s.value ? s.color : "#666",
                                        }}>
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Panel label="Описание"><p style={{ fontSize: "14px", lineHeight: "1.7", color: "#bbb", whiteSpace: "pre-wrap" }}>{selected.description}</p></Panel>

                        <Panel label="Мои заметки">
                            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Заметка..." rows={3} style={{ ...inputStyle, resize: "vertical" }} />
                            <button onClick={() => saveNotes(selected.id)} style={{ marginTop: "8px", padding: "8px 20px", borderRadius: "8px", background: "#FF4D00", color: "#fff", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                                Сохранить
                            </button>
                        </Panel>

                        <a href={`https://t.me/${selected.telegram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", borderRadius: "10px", background: "linear-gradient(135deg, #0088cc 0%, #0066aa 100%)", color: "#fff", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
                            <TgIcon /> Написать в Telegram
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ───────────────────────────────────── */
/* ─── PROJECTS TAB ─── */
/* ───────────────────────────────────── */
function ProjectsTab() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [editing, setEditing] = useState<Partial<Project> | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const fetchProjects = useCallback(async () => {
        try {
            const res = await fetch("/api/projects");
            setProjects(await res.json());
        } catch { } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchProjects(); }, [fetchProjects]);

    const saveProject = async () => {
        if (!editing) return;
        const isNew = !editing.id;
        const url = isNew ? "/api/projects" : `/api/projects/${editing.id}`;
        const method = isNew ? "POST" : "PATCH";

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editing),
        });
        setEditing(null);
        fetchProjects();
    };

    const deleteProject = async (id: string) => {
        if (!confirm("Удалить проект?")) return;
        await fetch(`/api/projects/${id}`, { method: "DELETE" });
        fetchProjects();
    };

    const toggleVisibility = async (p: Project) => {
        await fetch(`/api/projects/${p.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ visible: !p.visible }),
        });
        fetchProjects();
    };

    const handleImageUpload = async (file: File) => {
        setUploading(true);
        try {
            // Get upload config (VPS URL + secret)
            const cfgRes = await fetch("/api/upload-config");
            const cfg = await cfgRes.json();

            // Upload directly to VPS (bypasses Netlify body limit)
            const form = new FormData();
            form.append("file", file);
            const res = await fetch(`${cfg.filesServerUrl}/upload`, {
                method: "POST",
                headers: { "x-upload-secret": cfg.uploadSecret },
                body: form,
            });
            const data = await res.json();
            if (data.url) {
                // Store proxied URL for HTTPS display
                setEditing((prev) => prev ? { ...prev, imageUrl: `/api/files${data.url}` } : prev);
            }
        } catch (e) {
            console.error("Upload failed:", e);
        } finally {
            setUploading(false);
        }
    };

    const handleImageDelete = async () => {
        if (!editing?.imageUrl) return;
        const filename = editing.imageUrl.split("/").pop();
        if (filename) {
            try {
                const cfgRes = await fetch("/api/upload-config");
                const cfg = await cfgRes.json();
                await fetch(`${cfg.filesServerUrl}/delete/${filename}`, {
                    method: "DELETE",
                    headers: { "x-upload-secret": cfg.uploadSecret },
                });
            } catch (e) {
                console.error("Delete failed:", e);
            }
        }
        setEditing((prev) => prev ? { ...prev, imageUrl: "" } : prev);
    };

    const emptyProject: Partial<Project> = {
        titleEn: "", titleRu: "", descEn: "", descRu: "",
        detailsEn: "", detailsRu: "", tags: [], price: "", imageUrl: "", link: "", visible: true, order: projects.length,
    };

    return (
        <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: 700 }}>Управление проектами</h2>
                <button
                    onClick={() => setEditing(emptyProject)}
                    style={{ padding: "10px 24px", borderRadius: "10px", background: "#FF4D00", color: "#fff", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                >
                    + Добавить проект
                </button>
            </div>

            {loading ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#555" }}>Загрузка...</div>
            ) : projects.length === 0 && !editing ? (
                <div style={{ padding: "60px", textAlign: "center", color: "#555" }}>
                    <p style={{ fontSize: "15px", marginBottom: "12px" }}>Проектов пока нет</p>
                    <p style={{ fontSize: "13px", color: "#444" }}>Нажмите «Добавить проект», чтобы создать первый.<br />Пока в БД пусто — сайт показывает проекты из translations.ts</p>
                </div>
            ) : (
                <div style={{ display: "grid", gap: "12px" }}>
                    {projects.map((p) => (
                        <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", borderRadius: "12px", background: cardBg, border: cardBorder }}>
                            {/* Visibility dot */}
                            <button
                                onClick={() => toggleVisibility(p)}
                                title={p.visible ? "Скрыть" : "Показать"}
                                style={{
                                    width: "10px", height: "10px", borderRadius: "50%", border: "none", cursor: "pointer",
                                    background: p.visible ? "#22c55e" : "#555",
                                    flexShrink: 0,
                                }}
                            />
                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                                    <span style={{ fontWeight: 600, fontSize: "14px" }}>{p.titleRu}</span>
                                    <span style={{ fontSize: "11px", color: "#666" }}>/ {p.titleEn}</span>
                                </div>
                                <div style={{ fontSize: "12px", color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.descRu}</div>
                            </div>
                            {/* Price */}
                            {p.price && (
                                <span style={{ fontSize: "12px", fontWeight: 600, color: "#22c55e", background: "rgba(34,197,94,0.1)", padding: "4px 12px", borderRadius: "20px", flexShrink: 0 }}>
                                    {p.price}
                                </span>
                            )}
                            {/* Tags preview */}
                            <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                                {p.tags.slice(0, 3).map((t) => (
                                    <span key={t} style={{ fontSize: "10px", color: "#FF4D00", background: "rgba(255,77,0,0.08)", padding: "2px 8px", borderRadius: "10px" }}>{t}</span>
                                ))}
                                {p.tags.length > 3 && <span style={{ fontSize: "10px", color: "#555" }}>+{p.tags.length - 3}</span>}
                            </div>
                            {/* Actions */}
                            <button onClick={() => setEditing(p)} style={{ padding: "6px 14px", borderRadius: "6px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#888", fontSize: "12px", cursor: "pointer" }}>
                                ✏️
                            </button>
                            <button onClick={() => deleteProject(p.id)} style={{ padding: "6px 14px", borderRadius: "6px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.1)", color: "#ef4444", fontSize: "12px", cursor: "pointer" }}>
                                🗑
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Editor Modal */}
            {editing && (
                <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setEditing(null)}>
                    <div style={{ width: "100%", maxWidth: "700px", maxHeight: "90vh", overflow: "auto", background: "#111120", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", padding: "32px" }} onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "24px" }}>
                            {editing.id ? "Редактировать проект" : "Новый проект"}
                        </h3>

                        <div style={{ display: "grid", gap: "16px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                <FieldInput label="Название (EN)" value={editing.titleEn || ""} onChange={(v) => setEditing({ ...editing, titleEn: v })} />
                                <FieldInput label="Название (RU)" value={editing.titleRu || ""} onChange={(v) => setEditing({ ...editing, titleRu: v })} />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                <FieldTextarea label="Описание (EN)" value={editing.descEn || ""} onChange={(v) => setEditing({ ...editing, descEn: v })} rows={2} />
                                <FieldTextarea label="Описание (RU)" value={editing.descRu || ""} onChange={(v) => setEditing({ ...editing, descRu: v })} rows={2} />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                <FieldTextarea label="Подробнее (EN)" value={editing.detailsEn || ""} onChange={(v) => setEditing({ ...editing, detailsEn: v })} rows={3} />
                                <FieldTextarea label="Подробнее (RU)" value={editing.detailsRu || ""} onChange={(v) => setEditing({ ...editing, detailsRu: v })} rows={3} />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                                <FieldInput
                                    label="Теги (через запятую)"
                                    value={(editing.tags || []).join(", ")}
                                    onChange={(v) => setEditing({ ...editing, tags: v.split(",").map((s) => s.trim()).filter(Boolean) })}
                                />
                                <FieldInput label="Цена" value={editing.price || ""} onChange={(v) => setEditing({ ...editing, price: v })} placeholder="$2,000" />
                                <FieldInput label="Ссылка" value={editing.link || ""} onChange={(v) => setEditing({ ...editing, link: v })} placeholder="https://..." />
                            </div>
                            {/* Image Upload */}
                            <div>
                                <span style={{ fontSize: "11px", color: "#666", display: "block", marginBottom: "6px" }}>Изображение проекта</span>
                                {editing.imageUrl ? (
                                    <div style={{ position: "relative", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                                        <img src={editing.imageUrl} alt="preview" style={{ width: "100%", maxHeight: "200px", objectFit: "cover", display: "block" }} />
                                        <button
                                            onClick={handleImageDelete}
                                            style={{
                                                position: "absolute", top: "8px", right: "8px",
                                                width: "28px", height: "28px", borderRadius: "50%",
                                                background: "rgba(239,68,68,0.9)", border: "none",
                                                color: "#fff", fontSize: "14px", cursor: "pointer",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <label
                                        style={{
                                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                            padding: "24px", borderRadius: "10px", cursor: uploading ? "wait" : "pointer",
                                            border: "2px dashed rgba(255,255,255,0.1)",
                                            background: "rgba(255,255,255,0.02)",
                                            transition: "border-color 0.2s",
                                        }}
                                        onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "rgba(255,77,0,0.4)"; }}
                                        onDragLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                                            const file = e.dataTransfer.files[0];
                                            if (file?.type.startsWith("image/")) handleImageUpload(file);
                                        }}
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleImageUpload(file);
                                            }}
                                        />
                                        <span style={{ fontSize: "24px", marginBottom: "4px" }}>{uploading ? "⏳" : "📷"}</span>
                                        <span style={{ fontSize: "12px", color: "#666" }}>
                                            {uploading ? "Загрузка..." : "Нажми или перетащи фото"}
                                        </span>
                                    </label>
                                )}
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#aaa", cursor: "pointer" }}>
                                    <input type="checkbox" checked={editing.visible !== false} onChange={(e) => setEditing({ ...editing, visible: e.target.checked })} />
                                    Видимый на сайте
                                </label>
                                <FieldInput label="Порядок" value={String(editing.order ?? 0)} onChange={(v) => setEditing({ ...editing, order: parseInt(v) || 0 })} />
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                            <button onClick={saveProject} style={{ padding: "10px 28px", borderRadius: "10px", background: "#FF4D00", color: "#fff", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                                {editing.id ? "Сохранить" : "Создать"}
                            </button>
                            <button onClick={() => setEditing(null)} style={{ padding: "10px 28px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#888", fontSize: "13px", cursor: "pointer" }}>
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ───────────────────────────────────── */
/* ─── SETTINGS TAB ─── */
/* ───────────────────────────────────── */
function SettingsTab() {
    const [settings, setSettings] = useState<Settings>({ showProjects: true });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch("/api/settings").then((r) => r.json()).then(setSettings).catch(() => { });
    }, []);

    const toggle = async (key: keyof Settings) => {
        const val = !settings[key];
        setSettings({ ...settings, [key]: val });
        await fetch("/api/settings", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ [key]: val }),
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div style={{ padding: "32px", maxWidth: "600px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "24px" }}>Настройки сайта</h2>

            <div style={{ background: cardBg, border: cardBorder, borderRadius: "12px", padding: "20px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "16px" }}>Видимость секций</h3>

                <ToggleRow label="Показывать блок «Проекты»" checked={settings.showProjects} onToggle={() => toggle("showProjects")} />
            </div>

            {saved && (
                <div style={{ marginTop: "12px", fontSize: "13px", color: "#22c55e" }}>✓ Сохранено</div>
            )}
        </div>
    );
}

/* ───────────────────────────────────── */
/* ─── SHARED COMPONENTS ─── */
/* ───────────────────────────────────── */
function InfoCard({ label, value, link }: { label: string; value: string; link?: string }) {
    return (
        <div style={{ background: cardBg, border: cardBorder, borderRadius: "10px", padding: "14px 16px" }}>
            <span style={{ fontSize: "11px", color: "#555", display: "block", marginBottom: "4px" }}>{label}</span>
            {link ? (
                <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: "#FF4D00", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}>{value}</a>
            ) : (
                <span style={{ fontWeight: 600, fontSize: "14px" }}>{value}</span>
            )}
        </div>
    );
}

function Panel({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ background: cardBg, border: cardBorder, borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
            <span style={{ fontSize: "11px", color: "#555", display: "block", marginBottom: "10px" }}>{label}</span>
            {children}
        </div>
    );
}

function FilterBtn({ active, onClick, label, dotColor }: { active: boolean; onClick: () => void; label: string; dotColor?: string }) {
    return (
        <button onClick={onClick} style={{
            display: "flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 500, cursor: "pointer",
            border: active ? "1px solid rgba(255, 77, 0, 0.3)" : "1px solid rgba(255,255,255,0.06)",
            background: active ? "rgba(255, 77, 0, 0.08)" : "rgba(255,255,255,0.02)",
            color: active ? "#FF4D00" : "#777",
        }}>
            {dotColor && <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: dotColor }} />}
            {label}
        </button>
    );
}

function FieldInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
    return (
        <div>
            <span style={{ fontSize: "11px", color: "#666", display: "block", marginBottom: "4px" }}>{label}</span>
            <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "rgba(255,77,0,0.4)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
        </div>
    );
}

function FieldTextarea({ label, value, onChange, rows }: { label: string; value: string; onChange: (v: string) => void; rows: number }) {
    return (
        <div>
            <span style={{ fontSize: "11px", color: "#666", display: "block", marginBottom: "4px" }}>{label}</span>
            <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} style={{ ...inputStyle, resize: "vertical" }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(255,77,0,0.4)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
        </div>
    );
}

function ToggleRow({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" }}>
            <span style={{ fontSize: "14px" }}>{label}</span>
            <button
                onClick={onToggle}
                style={{
                    width: "44px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer",
                    background: checked ? "#FF4D00" : "rgba(255,255,255,0.1)",
                    position: "relative", transition: "background 0.2s",
                }}
            >
                <span style={{
                    position: "absolute", width: "18px", height: "18px", borderRadius: "50%", background: "#fff", top: "3px",
                    left: checked ? "23px" : "3px", transition: "left 0.2s",
                }} />
            </button>
        </div>
    );
}

function TgIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
    );
}
