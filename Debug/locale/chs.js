(function () {
	L10n.init();
	/* General. */
	L10n.identity = '游戏';
	L10n.aborting = '终止';
	L10n.cancel = '取消';
	L10n.close = '关闭';
	L10n.ok = '确认';

	/* Errors. */
	L10n.errorTitle = '错误';
	L10n.errorNonexistentPassage = '段落"{passage}"不存在';
	L10n.errorSaveMissingData = '存档缺少必须的数据，可能被读取的文件不是存档或者存档被损坏';
	L10n.errorSaveIdMismatch = '保存{identity}是错误的';

	/* Warnings. */
	L10n._warningIntroLacking = '你的浏览器可能损坏或者被禁用';
	L10n._warningOutroDegraded = '，所以{identity}在受限制模式中运行。你可以继续运行，但是一些内容可能不能正确工作。';
	L10n.warningNoWebStorage = '{_warningIntroLacking} Web Storage API {_warningOutroDegraded}';
	L10n.warningDegraded = '{_warningIntroLacking} {identity}需要的功能 {_warningOutroDegraded}';

	/* Debug View. */
	L10n.debugViewTitle = '调试模式';
	L10n.debugViewToggle = '切换调试模式';

	/* UI bar. */
	L10n.uiBarToggle = '打开/关闭导航栏';
	L10n.uiBarBackward = '后退';
	L10n.uiBarForward = '前进';
	L10n.uiBarJumpto = '跳到{identity}的历史记录中的某一点';

	/* Jump To. */
	L10n.jumptoTitle = '跳到';
	L10n.jumptoTurn = '转到';
	L10n.jumptoUnavailable = '目前没有跳跃点\u2026';

	/* Saves. */
	L10n.savesTitle = '存档';
	L10n.savesDisallowed = '在这个段落中不允许存档';
	L10n.savesEmptySlot = '\u2014 插槽空 \u2014';
	L10n.savesIncapable = '{_warningIntroLacking}支持存档所需的功能，因此本次游戏的存档功能已被禁用';
	L10n.savesLabelAuto = '自动存档';
	L10n.savesLabelDelete = '删除';
	L10n.savesLabelExport = '另存为\u2026';
	L10n.savesLabelImport = '读取\u2026';
	L10n.savesLabelLoad = '读取';
	L10n.savesLabelClear = '全部删除';
	L10n.savesLabelSave = '保存';
	L10n.savesLabelSlot = '插槽';
	L10n.savesSavedOn = '保存在：';
	L10n.savesUnavailable = '未找到存档插槽\u2026';
	L10n.savesUnknownDate = '未知';

	/* Settings. */
	L10n.settingsTitle = '设置';
	L10n.settingsOff = '关闭';
	L10n.settingsOn = '开启';
	L10n.settingsReset = '重置为默认值';

	/* Restart. */
	L10n.restartTitle = '重新开始';
	L10n.restartPrompt = '你确定要重新开始吗？未保存的进度将会丢失。';

	/* Share. */
	L10n.shareTitle = '分享';

	/* Autoload. */
	L10n.autoloadTitle = '自动保存';
	L10n.autoloadCancel = '前往最初的段落';
	L10n.autoloadOk = '读取自动存档';
	L10n.autoloadPrompt = '有一个自动存档，读取它还是前往最初的段落？';

	/* Macros. */
	L10n.macroBackText = '返回';
	L10n.macroReturnText = '返回';
})();
