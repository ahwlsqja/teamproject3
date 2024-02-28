export default function (err, req, res, next) {
  console.error(err);

  if (err.message === "로그인을 먼저 진행해주세요.") {
    res.status(401).json({ message: "로그인을 먼저 진행해주세요." });
  }

  if (err.message === "해당 시터가 존재하지 않습니다.") {
    res.status(400).json({ message: "해당 시터가 존재하지 않습니다." });
  }

  if (
    err.message === "비밀 번호가 틀렸습니다. 댓글을 작성할 권한이 없습니다."
  ) {
    res.status(403).json({
      message: "비밀 번호가 틀렸습니다. 댓글을 작성할 권한이 없습니다.",
    });
  }

  if (err.message === "비밀 번호가 틀렸습니다.") {
    res.status(403).json({ message: "비밀 번호가 틀렸습니다." });
  }

  if (err.message === "존재하지 않는 댓글입니다.") {
    res.status(400).json({ message: "존재하지 않는 댓글입니다." });
  }

  res.status(500).json({ message: "서버 내부에서 에러가 발생했습니다." });
}
