# DouPoCQ_WolrdBooks
自用

## 本地版本快照

首次配置后，每次修改完成可运行：

```powershell
.\snapshot.ps1 -Message "本次修改说明"
```

快照脚本会在当前进程内处理仓库所有权检查，不需要修改全局 Git 配置。

查看历史：

```powershell
git -c safe.directory="E:/Sillystavern_CharCards/写卡工作区/DouPoCQ_WolrdBooks" log --oneline --all
```

恢复单个文件到最近一次提交：

```powershell
.\restore.ps1 -Commit HEAD -Path "文件路径"
```

恢复整个工作区到指定版本前，请先确认没有需要保留的未提交修改：

```powershell
.\restore.ps1 -Commit 提交编号
```
