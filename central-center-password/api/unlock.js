const crypto = require("crypto");

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}
function sign(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "허용되지 않은 요청입니다." });
  }
  const expected = process.env.PAGE_PASSWORD;
  const secret = process.env.PAGE_SESSION_SECRET;
  if (!expected || !secret) {
    return res.status(500).json({ message: "서버 보안 설정이 완료되지 않았습니다." });
  }
  const supplied = req.body && req.body.password;
  if (typeof supplied !== "string" || !safeEqual(supplied, expected)) {
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  }
  const expires = Date.now() + 60 * 60 * 1000;
  const payload = String(expires);
  const token = `${payload}.${sign(payload, secret)}`;
  res.setHeader("Set-Cookie", `central_access=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`);
  return res.status(200).json({ ok: true });
};
