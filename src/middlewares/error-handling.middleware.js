export default function (err, req, res, next) {
  console.error(err);
  if (err.message === "이메일이 일치하지 않습니다.") {
    res.status(400).json({ message: "이메일이 일치하지 않습니다." });
  }
  if (err.message === "비밀번호가 일치하지 않습니다.") {
    res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
  }
  if (err.message === "해당하는 반려동물이 존재하지 않습니다.") {
    res.status(400).json({ mssage: "해당하는 반려동물이 존재하지 않습니다." });
  }
  if (err.message === "해당하는 사용자가 없습니다.") {
    res.status(400).json({ message: "해당하는 사용자가 없습니다." });
  }
  res.status(500).json({ message: "서비 내부에서 에러가 발생했습니다." });
}
