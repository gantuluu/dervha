import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("trading.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    whatsapp TEXT UNIQUE,
    password TEXT,
    full_name TEXT,
    address TEXT,
    city TEXT,
    province TEXT,
    country TEXT,
    bank_name TEXT,
    bank_account TEXT,
    bank_owner TEXT,
    referral_code TEXT UNIQUE,
    referred_by TEXT,
    is_admin INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS packages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    profit_percent REAL,
    min_amount INTEGER,
    max_amount INTEGER,
    duration_hours INTEGER DEFAULT 72
  );

  CREATE TABLE IF NOT EXISTS wallets (
    user_id INTEGER PRIMARY KEY,
    trading_balance REAL DEFAULT 0,
    profit_balance REAL DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS deposits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    amount REAL,
    proof_url TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS withdraws (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    amount REAL,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS profits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    amount REAL,
    package_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT, -- deposit, withdraw, profit, referral_bonus
    amount REAL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// Seed Packages if empty
const packageCount = db.prepare("SELECT COUNT(*) as count FROM packages").get() as { count: number };
if (packageCount.count === 0) {
  const insertPackage = db.prepare("INSERT INTO packages (name, profit_percent, min_amount, max_amount) VALUES (?, ?, ?, ?)");
  insertPackage.run("Paket A", 15, 500000, 4900000);
  insertPackage.run("Paket B", 20, 5000000, 49000000);
  insertPackage.run("Paket C", 25, 50000000, 999999999);
  insertPackage.run("Paket D", 30, 1000000000, 999999999999);
}

// Seed Admin if empty
const adminCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE is_admin = 1").get() as { count: number };
if (adminCount.count === 0) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO users (whatsapp, password, full_name, is_admin, referral_code) VALUES (?, ?, ?, ?, ?)")
    .run("admin", hashedPassword, "Administrator", 1, "ADMIN");
}

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// Auth Middleware
const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const adminOnly = (req: any, res: any, next: any) => {
  if (req.user.is_admin !== 1) return res.status(403).json({ error: "Forbidden" });
  next();
};

// --- Auth Routes ---
app.post("/api/auth/register", (req, res) => {
  const { whatsapp, password, full_name, address, city, province, country, bank_name, bank_account, bank_owner, referred_by } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  try {
    const result = db.prepare(`
      INSERT INTO users (whatsapp, password, full_name, address, city, province, country, bank_name, bank_account, bank_owner, referral_code, referred_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(whatsapp, hashedPassword, full_name, address, city, province, country, bank_name, bank_account, bank_owner, referralCode, referred_by);

    db.prepare("INSERT INTO wallets (user_id) VALUES (?)").run(result.lastInsertRowid);

    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.post("/api/auth/login", (req, res) => {
  const { whatsapp, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE whatsapp = ?").get(whatsapp) as any;

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user.id, whatsapp: user.whatsapp, is_admin: user.is_admin }, JWT_SECRET);
    res.json({ token, user: { id: user.id, full_name: user.full_name, whatsapp: user.whatsapp, is_admin: user.is_admin, referral_code: user.referral_code } });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// --- User Routes ---
app.get("/api/user/profile", authenticate, (req: any, res) => {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
  res.json(user);
});

app.get("/api/user/wallet", authenticate, (req: any, res) => {
  const wallet = db.prepare("SELECT * FROM wallets WHERE user_id = ?").get(req.user.id);
  res.json(wallet);
});

app.post("/api/user/deposit", authenticate, (req: any, res) => {
  const { amount, proof_url } = req.body;
  db.prepare("INSERT INTO deposits (user_id, amount, proof_url) VALUES (?, ?, ?)").run(req.user.id, amount, proof_url);
  res.json({ success: true });
});

app.post("/api/user/withdraw", authenticate, (req: any, res) => {
  const { amount } = req.body;
  const wallet = db.prepare("SELECT profit_balance FROM wallets WHERE user_id = ?").get(req.user.id) as any;
  if (wallet.profit_balance < amount) return res.status(400).json({ error: "Insufficient profit balance" });

  db.prepare("INSERT INTO withdraws (user_id, amount) VALUES (?, ?)").run(req.user.id, amount);
  // Deduct balance immediately or on approval? User said "Admin approve withdraw".
  // Usually we deduct immediately to prevent double spend.
  db.prepare("UPDATE wallets SET profit_balance = profit_balance - ? WHERE user_id = ?").run(amount, req.user.id);

  res.json({ success: true });
});

app.get("/api/user/history", authenticate, (req: any, res) => {
  const history = db.prepare("SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC").all(req.user.id);
  res.json(history);
});

app.get("/api/user/profits", authenticate, (req: any, res) => {
  const profits = db.prepare("SELECT * FROM profits WHERE user_id = ? ORDER BY created_at DESC").all(req.user.id);
  res.json(profits);
});

app.get("/api/user/referrals", authenticate, (req: any, res) => {
  const user = db.prepare("SELECT referral_code FROM users WHERE id = ?").get(req.user.id) as any;
  const referrals = db.prepare("SELECT full_name, created_at FROM users WHERE referred_by = ?").all(user.referral_code);
  const commission = db.prepare("SELECT SUM(amount) as total FROM transactions WHERE user_id = ? AND type = 'referral_bonus'").get(req.user.id) as any;
  res.json({ referrals, total_commission: commission.total || 0, referral_code: user.referral_code });
});

// --- Admin Routes ---
app.get("/api/admin/stats", authenticate, adminOnly, (req, res) => {
  const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
  const totalDeposit = db.prepare("SELECT SUM(amount) as total FROM deposits WHERE status = 'approved'").get() as any;
  const totalWithdraw = db.prepare("SELECT SUM(amount) as total FROM withdraws WHERE status = 'approved'").get() as any;
  const totalProfit = db.prepare("SELECT SUM(amount) as total FROM profits").get() as any;
  res.json({
    total_users: totalUsers.count,
    total_deposit: totalDeposit.total || 0,
    total_withdraw: totalWithdraw.total || 0,
    total_profit: totalProfit.total || 0
  });
});

app.get("/api/admin/users", authenticate, adminOnly, (req, res) => {
  const users = db.prepare("SELECT u.*, w.trading_balance, w.profit_balance FROM users u JOIN wallets w ON u.id = w.user_id").all();
  res.json(users);
});

app.get("/api/admin/deposits", authenticate, adminOnly, (req, res) => {
  const deposits = db.prepare("SELECT d.*, u.full_name, u.whatsapp FROM deposits d JOIN users u ON d.user_id = u.id ORDER BY d.created_at DESC").all();
  res.json(deposits);
});

app.post("/api/admin/deposits/:id/approve", authenticate, adminOnly, (req, res) => {
  const deposit = db.prepare("SELECT * FROM deposits WHERE id = ?").get(req.params.id) as any;
  if (deposit.status !== 'pending') return res.status(400).json({ error: "Already processed" });

  db.prepare("UPDATE deposits SET status = 'approved' WHERE id = ?").run(req.params.id);
  db.prepare("UPDATE wallets SET trading_balance = trading_balance + ? WHERE user_id = ?").run(deposit.amount, deposit.user_id);

  db.prepare("INSERT INTO transactions (user_id, type, amount, description) VALUES (?, ?, ?, ?)")
    .run(deposit.user_id, 'deposit', deposit.amount, 'Deposit approved');

  // Referral Bonus (5% of deposit)
  const user = db.prepare("SELECT referred_by FROM users WHERE id = ?").get(deposit.user_id) as any;
  if (user.referred_by) {
    const referrer = db.prepare("SELECT id FROM users WHERE referral_code = ?").get(user.referred_by) as any;
    if (referrer) {
      const bonus = deposit.amount * 0.05;
      db.prepare("UPDATE wallets SET profit_balance = profit_balance + ? WHERE user_id = ?").run(bonus, referrer.id);
      db.prepare("INSERT INTO transactions (user_id, type, amount, description) VALUES (?, ?, ?, ?)")
        .run(referrer.id, 'referral_bonus', bonus, `Referral bonus from ${deposit.user_id}`);
    }
  }

  res.json({ success: true });
});

app.get("/api/admin/withdraws", authenticate, adminOnly, (req, res) => {
  const withdraws = db.prepare("SELECT w.*, u.full_name, u.whatsapp, u.bank_name, u.bank_account, u.bank_owner FROM withdraws w JOIN users u ON w.user_id = u.id ORDER BY w.created_at DESC").all();
  res.json(withdraws);
});

app.post("/api/admin/withdraws/:id/approve", authenticate, adminOnly, (req, res) => {
  const withdraw = db.prepare("SELECT * FROM withdraws WHERE id = ?").get(req.params.id) as any;
  if (withdraw.status !== 'pending') return res.status(400).json({ error: "Already processed" });

  db.prepare("UPDATE withdraws SET status = 'approved' WHERE id = ?").run(req.params.id);
  db.prepare("INSERT INTO transactions (user_id, type, amount, description) VALUES (?, ?, ?, ?)")
    .run(withdraw.user_id, 'withdraw', withdraw.amount, 'Withdraw approved');

  res.json({ success: true });
});

// --- Profit Engine (Manual Trigger for Demo, but logic is here) ---
app.post("/api/admin/run-profit-engine", authenticate, adminOnly, (req, res) => {
  const usersWithBalance = db.prepare("SELECT user_id, trading_balance FROM wallets WHERE trading_balance > 0").all() as any[];
  const packages = db.prepare("SELECT * FROM packages").all() as any[];

  let processed = 0;
  for (const row of usersWithBalance) {
    const pkg = packages.find(p => row.trading_balance >= p.min_amount && row.trading_balance <= p.max_amount)
               || packages[packages.length - 1]; // Fallback to highest if over max

    const profitAmount = row.trading_balance * (pkg.profit_percent / 100);

    db.prepare("UPDATE wallets SET profit_balance = profit_balance + ? WHERE user_id = ?").run(profitAmount, row.user_id);
    db.prepare("INSERT INTO profits (user_id, amount, package_id) VALUES (?, ?, ?)").run(row.user_id, profitAmount, pkg.id);
    db.prepare("INSERT INTO transactions (user_id, type, amount, description) VALUES (?, ?, ?, ?)")
      .run(row.user_id, 'profit', profitAmount, `Profit from ${pkg.name}`);

    processed++;
  }
  res.json({ success: true, processed });
});

// --- Vite Middleware ---
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
