
const API_BASE = "http://localhost:5000";

const seed = {
    customers: [],
    products: [
        { id: 1, name: "Smartphone X", brand: "NovaTech", category: "Electronics", model: "NT-X10", months: 12 },
        { id: 2, name: "Laptop Pro 14", brand: "Vertex", category: "Computers", model: "VP-14", months: 24 },
        { id: 3, name: "Smart TV 43", brand: "ViewMax", category: "Home Appliances", model: "VM-43", months: 12 }
    ],
    registrations: [
        { id: 1, customer: "Aarav Sharma", product: "Smartphone X", serial: "NTX-2026-001", purchase: "2026-02-12", start: "2026-02-12", end: "2027-02-12", status: "ACTIVE" },
        { id: 2, customer: "Priya Verma", product: "Laptop Pro 14", serial: "VP14-2025-044", purchase: "2025-04-05", start: "2025-04-05", end: "2027-04-05", status: "ACTIVE" },
        { id: 3, customer: "Rahul Mehta", product: "Smart TV 43", serial: "VM43-2024-018", purchase: "2024-01-20", start: "2024-01-20", end: "2025-01-20", status: "EXPIRED" }
    ],
    claims: [
        { id: 1, serial: "NTX-2026-001", issue: "Battery drains quickly", type: "REPAIR", status: "UNDER REVIEW", date: "2026-10-29" },
        { id: 2, serial: "VP14-2025-044", issue: "Display flickering", type: "REPAIR", status: "APPROVED", date: "2026-10-27" },
        { id: 3, serial: "VM43-2024-018", issue: "Screen not turning on", type: "INSPECTION", status: "REJECTED", date: "2026-10-20" }
    ],
    repairs: [
        { id: 1, claim: "CLM-1002", diagnosis: "Loose display connector", action: "Connector reseated and tested", cost: "850", status: "Completed" },
        { id: 2, claim: "CLM-1001", diagnosis: "Battery health below threshold", action: "Battery inspection pending", cost: "0", status: "In progress" }
    ]
};

let db = {};

for (const k in seed) {
    try {
        db[k] = JSON.parse(localStorage.getItem("wc_" + k)) || seed[k];
    } catch {
        db[k] = seed[k];
    }
}

db.customers = [];

const configs = {
    customers: {
        title: "Customers",
        singular: "Customer",
        fields: [["name", "Full name"], ["email", "Email", "email"], ["phone", "Phone"], ["city", "City"]],
        cols: ["Name", "Email", "Phone", "City"]
    },
    products: {
        title: "Products",
        singular: "Product",
        fields: [["name", "Product name"], ["brand", "Brand"], ["category", "Category"], ["model", "Model number"], ["months", "Warranty (months)", "number"]],
        cols: ["Product", "Brand", "Category", "Model", "Warranty"]
    },
    registrations: {
        title: "Product Registrations",
        singular: "Registration",
        fields: [["customer", "Customer name"], ["product", "Product name"], ["serial", "Serial number"], ["purchase", "Purchase date", "date"], ["start", "Warranty start", "date"], ["end", "Warranty end", "date"], ["status", "Status", "select", ["ACTIVE", "EXPIRED", "TRANSFERRED"]]],
        cols: ["Customer", "Product", "Serial number", "Purchase date", "Warranty end", "Status"]
    },
    claims: {
        title: "Warranty Claims",
        singular: "Claim",
        fields: [["serial", "Product serial number"], ["issue", "Issue description", "textarea"], ["type", "Claim type", "select", ["REPAIR", "REPLACEMENT", "INSPECTION"]], ["status", "Claim status", "select", ["SUBMITTED", "UNDER REVIEW", "APPROVED", "REJECTED", "COMPLETED"]], ["date", "Claim date", "date"]],
        cols: ["Serial number", "Issue", "Type", "Date", "Status"]
    },
    repairs: {
        title: "Repair History",
        singular: "Repair record",
        fields: [["claim", "Claim reference"], ["diagnosis", "Diagnosis", "textarea"], ["action", "Repair action", "textarea"], ["cost", "Labour cost (₹)", "number"], ["status", "Repair status", "select", ["In progress", "Completed", "On hold"]]],
        cols: ["Claim", "Diagnosis", "Repair action", "Labour cost", "Status"]
    }
};

let page = "dashboard";
let editing = null;

const $ = s => document.querySelector(s); 

function showToast(message) {
    alert(message);
}

$("#today").textContent = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
});

function persist(k) {
    localStorage.setItem("wc_" + k, JSON.stringify(db[k]));
}

async function fetchCustomers() {
    try {
        const response = await fetch(`${API_BASE}/api/customers`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to fetch customers");
        }

        db.customers = result.map(customer => ({
            id: customer._id,
            name: customer.full_name,
            email: customer.email,
            phone: customer.phone || "",
            city: customer.city || ""
        }));

        render();
        console.log("Customers loaded from MongoDB.");
    } catch (error) {
        console.error("Error fetching customers:", error);
        toast("Could not load customers. Check that the backend is running.");
    }
}

function esc(v = "") {
    return String(v).replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[c]));
}

function pill(s) {
    let c = /reject|expired|hold/i.test(s) ? "bad" : /review|progress|submitted/i.test(s) ? "warn" : "";
    return `<span class="pill ${c}">${esc(s || "—")}</span>`;
}

function setPage(p) {
    page = p;

    document.querySelectorAll(".nav-item").forEach(b =>
        b.classList.toggle("active", b.dataset.page === p)
    );

    $("#pageTitle").textContent =
        p === "dashboard" ? "Dashboard" :
        p === "reports" ? "Reports" : configs[p].title;

    $("#crumb").textContent = p.toUpperCase();

    render();
}

document.querySelectorAll(".nav-item").forEach(b =>
    b.addEventListener("click", () => setPage(b.dataset.page))
);

function render() {
    if (page === "dashboard") return dashboard();
    if (page === "reports") return reports();

    tablePage(page);
}

function dashboard() {
    let active = db.registrations.filter(x => x.status === "ACTIVE").length;

    $("#content").innerHTML = `
        <div class="welcome">
            <div>
                <h2>Good evening, Admin 👋</h2>
                <p>Here's what's happening with your warranty operations today.</p>
            </div>
            <button class="btn primary" id="quickAdd">＋ Add new record</button>
        </div>

        <div class="stats">
            ${[
                ["Total customers", db.customers.length, "♙", "Registered users"],
                ["Products listed", db.products.length, "▣", "Product catalogue"],
                ["Active warranties", active, "✓", "Currently covered"],
                ["Open claims", db.claims.filter(x => !["COMPLETED", "REJECTED"].includes(x.status)).length, "◷", "Awaiting resolution"]
            ].map(a => `
                <div class="stat">
                    <div class="stat-top">
                        <span>${a[0]}</span>
                        <span class="stat-icon">${a[2]}</span>
                    </div>
                    <strong>${a[1]}</strong>
                    <small>${a[3]}</small>
                </div>
            `).join("")}
        </div>

        <div class="grid-two">
            <div class="panel">
                <div class="panel-head">
                    <h3>Recent warranty claims</h3>
                    <small>Latest activity</small>
                </div>
                ${miniTable()}
            </div>

            <div class="panel">
                <div class="panel-head">
                    <h3>Recent activity</h3>
                    <small>Overview</small>
                </div>

                <div class="activity">
                    <i class="dot"></i>
                    <div><b>${db.customers.length} customers registered</b><small>Customer database summary</small></div>
                </div>

                <div class="activity">
                    <i class="dot"></i>
                    <div><b>${active} active warranties</b><small>Products currently under coverage</small></div>
                </div>

                <div class="activity">
                    <i class="dot"></i>
                    <div><b>${db.repairs.length} repair records logged</b><small>Service history records</small></div>
                </div>

                <div class="activity">
                    <i class="dot"></i>
                    <div><b>${db.claims.length} claims submitted</b><small>Across all registered products</small></div>
                </div>
            </div>
        </div>
    `;

    $("#quickAdd").onclick = () => openModal("customers");
}

function miniTable() {
    return `
        <div class="table-wrap">
            <table>
                <thead>
                    <tr><th>CLAIM</th><th>SERIAL</th><th>STATUS</th></tr>
                </thead>
                <tbody>
                    ${db.claims.slice(-4).reverse().map(x => `
                        <tr>
                            <td class="person">#CLM-${1000 + x.id}</td>
                            <td>${esc(x.serial)}</td>
                            <td>${pill(x.status)}</td>
                        </tr>
                    `).join("") || `
                        <tr><td colspan="3" class="empty">No claims yet</td></tr>
                    `}
                </tbody>
            </table>
        </div>
    `;
}

function tablePage(key) {
    let c = configs[key];
    let rows = db[key];

    $("#content").innerHTML = `
        <div class="welcome">
            <div>
                <h2>${c.title} directory</h2>
                <p>Manage and maintain ${c.title.toLowerCase()} records.</p>
            </div>
            <button class="btn primary" id="addBtn">＋ Add ${c.singular}</button>
        </div>

        <div class="panel">
            <div class="toolbar">
                <input class="search" id="search" placeholder="Search ${c.title.toLowerCase()}...">
                <small style="color:#8c97a9;align-self:center">${rows.length} records</small>
            </div>

            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            ${c.cols.map(x => `<th>${x.toUpperCase()}</th>`).join("")}
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody id="tbody">
                        ${rows.map((r, i) => rowHtml(key, r, i)).join("") ||
                        `<tr><td colspan="${c.cols.length + 1}" class="empty">No records found. Add your first ${c.singular.toLowerCase()}.</td></tr>`}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    $("#addBtn").onclick = () => openModal(key);

    $("#search").oninput = e => {
        let q = e.target.value.toLowerCase();

        $("#tbody").innerHTML = rows
            .filter(r => Object.values(r).join(" ").toLowerCase().includes(q))
            .map(r => rowHtml(key, r, rows.indexOf(r)))
            .join("") ||
            `<tr><td colspan="${c.cols.length + 1}" class="empty">No matching records</td></tr>`;

        wireRows(key);
    };

    wireRows(key);
}

function rowHtml(k, r, i) {
    let vals = {
        customers: [r.name, r.email, r.phone, r.city],
        products: [r.name, r.brand, r.category, r.model, r.months + " months"],
        registrations: [r.customer, r.product, r.serial, r.purchase, r.end, pill(r.status)],
        claims: [r.serial, r.issue, r.type, r.date, pill(r.status)],
        repairs: [r.claim, r.diagnosis, r.action, "₹" + r.cost, pill(r.status)]
    }[k];

    return `
        <tr>
            ${vals.map(v => `
                <td>${v && String(v).startsWith("<span") ? v : esc(v)}</td>
            `).join("")}

            <td>
                <button class="btn secondary edit" data-i="${i}">Edit</button>
                <button class="btn secondary delete" data-i="${i}">Delete</button>
            </td>
        </tr>
    `;
}

function wireRows(k) {
    document.querySelectorAll(".edit").forEach(b => {
        b.onclick = () => openModal(k, +b.dataset.i);
    });

    document.querySelectorAll(".delete").forEach(b => {
        b.onclick = async () => {
            const index = +b.dataset.i;

            if (!confirm("Are you sure you want to delete this record?")) {
                return;
            }

            // Delete customer from MongoDB
            if (k === "customers") {
                try {
                    const customerId = db.customers[index].id;

                    const response = await fetch(
                        `${API_BASE}/api/customers/${customerId}`,
                        {
                            method: "DELETE"
                        }
                    );

                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(result.message || "Deletion failed");
                    }

                    await fetchCustomers();
                    showToast("Customer deleted successfully!");
                } catch (error) {
                    console.error("Customer deletion error:", error);
                    showToast(error.message || "Could not delete customer");
                }

                return;
            }

            // Delete other records from localStorage
            db[k].splice(index, 1);
            persist(k);
            render();
            showToast("Record deleted successfully!");
        };
    });
}

function openModal(k, i = null) {
    editing = i;

    let c = configs[k];
    let r = i === null ? {} : db[k][i];

    $("#modalTitle").textContent =
        (i === null ? "Add " : "Edit ") + c.singular;

    $("#formFields").innerHTML = c.fields.map(([name, label, type = "text", opts]) => `
        <div class="field ${type === "textarea" ? "full" : ""}">
            <label>${label}</label>

            ${
                type === "select"
                    ? `<select name="${name}">
                        ${opts.map(o => `
                            <option ${r[name] === o ? "selected" : ""}>${o}</option>
                        `).join("")}
                    </select>`
                    : type === "textarea"
                        ? `<textarea name="${name}" required>${esc(r[name] || "")}</textarea>`
                        : `<input name="${name}" type="${type}" value="${esc(r[name] || "")}" ${name === "months" || name === "cost" ? "min=0" : ""} required>`
            }
        </div>
    `).join("");

    $("#modalBackdrop").classList.add("show");
    $("#recordForm").dataset.key = k;
}

function closeModal() {
    $("#modalBackdrop").classList.remove("show");
}

$("#closeModal").onclick = $("#cancelModal").onclick = closeModal;

$("#modalBackdrop").onclick = e => {
    if (e.target.id === "modalBackdrop") closeModal();
};

function reports() {
    $("#content").innerHTML = `
        <div class="welcome">
            <div>
                <h2>Reports & analytics</h2>
                <p>Quick summary generated from the current demonstration records.</p>
            </div>
        </div>

        <div class="report-grid">
            <div class="report-card">
                <h3>Warranty coverage</h3>
                <strong>${db.registrations.filter(x => x.status === "ACTIVE").length}</strong>
                <p>Active product registrations currently marked as covered.</p>
            </div>

            <div class="report-card">
                <h3>Claim resolution</h3>
                <strong>${db.claims.filter(x => x.status === "COMPLETED").length}</strong>
                <p>Warranty claims marked as completed.</p>
            </div>

            <div class="report-card">
                <h3>Repair expenditure</h3>
                <strong>₹${db.repairs.reduce((s, x) => s + (+x.cost || 0), 0).toLocaleString("en-IN")}</strong>
                <p>Total labour cost across recorded repairs.</p>
            </div>
        </div>

        <div class="panel" style="margin-top:16px">
            <div class="panel-head">
                <h3>Claim status breakdown</h3>
                <small>Current records</small>
            </div>

            ${["SUBMITTED", "UNDER REVIEW", "APPROVED", "REJECTED", "COMPLETED"].map(s => `
                <div style="display:flex;justify-content:space-between;padding:12px 2px;border-bottom:1px solid #f0f2f6;font-size:12px">
                    ${pill(s)}
                    <b>${db.claims.filter(x => x.status === s).length}</b>
                </div>
            `).join("")}
        </div>
    `;
}

$("#recordForm").onsubmit = async e => {
    e.preventDefault();

    const k = e.target.dataset.key;
    const c = configs[k];
    const data = Object.fromEntries(new FormData(e.target));

    if (k === "customers") {
        try {
            if (editing !== null) {
                toast("Customer editing API is not configured yet.");
                return;
            }

            const response = await fetch(`${API_BASE}/api/customers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    full_name: data.name,
                    email: data.email,
                    phone: data.phone,
                    city: data.city
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Customer saving failed");
            }

            await fetchCustomers();

            closeModal();
            editing = null;

            toast("Customer saved to MongoDB successfully!");
            return;

        } catch (error) {
            console.error("Customer save error:", error);
            toast(error.message || "Could not save customer.");
            return;
        }
    }

    if (editing === null) {
        data.id = Math.max(0, ...db[k].map(x => x.id)) + 1;
    } else {
        data.id = db[k][editing].id;
    }

    if (k === "products") data.months = +data.months;
    if (k === "repairs") data.cost = +data.cost;

    if (editing === null) {
        db[k].push(data);
    } else {
        db[k][editing] = data;
    }

    persist(k);
    closeModal();
    editing = null;
    render();

    toast(c.singular + " saved successfully");
};

render();
fetchCustomers(); 



