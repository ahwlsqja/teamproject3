export default function (err, req, res, next) {
  console.error(err);

  if (err.message === "이미 시터로 가입한 이메일입니다.") {
    res.status(409).json({ message: "이미 시터로 가입한 이메일입니다." });
  }

  if (err.message === "인증번호가 없습니다.") {
    res.status(404).json({ message: "인증번호가 없습니다." });
  }

  if (err.message === "실패했습니다.") {
    res.status(401).json({ message: "실패했습니다." });
  }

  if (err.message === "존재하지 않는 이메일입니다.") {
    res.status(404).json({ message: "존재하지 않는 이메일입니다." });
  }

  if (err.message === "비밀번호가 일치하지 않습니다.") {
    res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  }

  if (err.message === "리프레쉬 토큰이 없습니다.") {
    res.status(404).json({ message: "리프레쉬 토큰이 없습니다." });
  }

  if (err.message === "리프레시 토큰이 유효하지 않습니다.") {
    res.status(401).json({ message: "리프레시 토큰이 유효하지 않습니다." });
  }

  if (err.message === "시터를 찾지 못했습니다") {
    res.status(404).json({ message: "시터를 찾지 못했습니다" });
  }

  res.status(500).json({ message: "서버 내부에서 에러가 발생했습니다." });
}
