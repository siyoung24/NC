const crypto = require("crypto");

function sign(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}
function validToken(token, secret) {
  if (!token || !secret) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [expires, signature] = parts;
  if (!/^\d+$/.test(expires) || Number(expires) < Date.now()) return false;
  const expected = sign(expires, secret);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
module.exports = async (req, res) => {
  const cookies = Object.fromEntries((req.headers.cookie || "").split(";").map(v => {
    const i = v.indexOf("=");
    return i < 0 ? [v.trim(), ""] : [v.slice(0, i).trim(), decodeURIComponent(v.slice(i + 1).trim())];
  }));
  if (!validToken(cookies.central_access, process.env.PAGE_SESSION_SECRET)) {
    res.setHeader("Cache-Control", "no-store");
    return res.status(401).send("접근 권한이 없습니다. 중앙 센터 홈페이지에서 비밀번호를 확인해 주세요.");
  }
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).send(`<!DOCTYPE html>
<html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>관계자 전용 자료실 | 중앙 센터</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#f1f4f6;color:#1b2b38;font-family:Arial,'Noto Sans KR',sans-serif}
header{background:#101d2b;color:white;padding:25px max(24px,calc((100% - 1040px)/2));}
header small{color:#9eb3c4;letter-spacing:.12em}header h1{margin:8px 0 0;font-size:25px}
main{max-width:1040px;margin:42px auto;padding:0 22px}.label{color:#54869a;font-size:11px;font-weight:bold;letter-spacing:.15em}
h2{font-size:22px;margin:8px 0 24px}.notice{background:white;border:1px solid #dce3e8;padding:22px;margin-bottom:14px}
.notice h3{font-size:16px;margin:0 0 10px}.notice p{font-size:13px;line-height:1.9;color:#62717c;margin:0}
table{width:100%;border-collapse:collapse;margin-top:14px;background:white;font-size:13px}td,th{padding:13px;border:1px solid #dce3e8;text-align:left}th{background:#e8eef1}
.back{display:inline-block;margin-top:25px;color:#315e78;text-decoration:none;font-size:13px}
</style></head><body>
<header><small>REPUBLIC OF KOREA · CENTRAL COMMAND / RESTRICTED</small><h1>관계자 전용 자료실</h1></header>
<main>
<div class="label">INTERNAL DOCUMENTS</div><h2>내부 열람 문서</h2>
<section class="notice"><h3>자료 열람 안내</h3><p>본 페이지는 관계자에게 제공되는 제한 열람 공간입니다. 열람 자료의 무단 복제 및 외부 공유를 금합니다. 아래 문서는 세계관 연출을 위한 예시 자료입니다.</p></section>
<section class="notice"><h3>연구동 운영 현황</h3><p>한국과학기술연구소 연구동은 센티넬 및 가이드의 생체 반응 분석과 가이딩 관련 연구를 수행합니다. 연구시설별 출입은 담당 부서의 확인 절차에 따릅니다.</p></section>
<section class="notice"><h3>관리 체계 점검 공지</h3><p>등록 정보 및 상태 모니터링 체계의 정기 점검이 예정되어 있습니다. 점검 시간 중 일부 내부 열람 기능의 이용이 제한될 수 있습니다.</p></section>
<table><thead><tr><th>문서 번호</th><th>문서명</th><th>열람 등급</th><th>상태</th></tr></thead><tbody>
<tr><td>CC-RS-001</td><td>연구동 시설 운영 지침</td><td>관계자</td><td>열람 가능</td></tr>
<tr><td>CC-MG-014</td><td>통합 관리 체계 안내</td><td>관계자</td><td>열람 가능</td></tr>
<tr><td>CC-OP-021</td><td>부대 지원 업무 절차</td><td>관계자</td><td>열람 가능</td></tr>
</tbody></table>
<a class="back" href="/">← 중앙 센터 홈페이지로 돌아가기</a>
</main></body></html>`);
};
