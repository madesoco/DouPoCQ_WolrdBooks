$(() => {
  const REGION_SCAN_CONSTANTS = {
    INJECT_ID: 'region-scan-greenlight-injection',
    LOG_PREFIX: '[区域绿灯扫描注入]',
  };

  function getCurrentRegion() {
    try {
      const mvuData = Mvu.getMvuData({ type: 'chat' });
      return _.trim(_.get(mvuData, 'stat_data.主角.所在区域', ''));
    } catch (error) {
      console.warn(`${REGION_SCAN_CONSTANTS.LOG_PREFIX} 读取所在区域失败`, error);
      return '';
    }
  }

  function buildStatusLines(region) {
    if (!region) {
      return '';
    }

    return [`stat_data.主角.所在区域: ${region}`, `主角当前所在区域: ${region}`, region].join('\n');
  }

  function removeRegionInjection() {
    try {
      uninjectPrompts([REGION_SCAN_CONSTANTS.INJECT_ID]);
    } catch (error) {
      console.warn(`${REGION_SCAN_CONSTANTS.LOG_PREFIX} 移除旧注入失败`, error);
    }
  }

  function refreshRegionInjection(reason) {
    const region = getCurrentRegion();

    removeRegionInjection();

    if (!region) {
      console.log(`${REGION_SCAN_CONSTANTS.LOG_PREFIX} 未找到所在区域，跳过注入`, reason || 'unknown');
      return;
    }

    const statusLines = buildStatusLines(region);

    const injectionPrompt = {
      id: REGION_SCAN_CONSTANTS.INJECT_ID,
      position: 'none',
      depth: 0,
      role: 'system',
      content: statusLines,
      should_scan: true,
    };

    injectPrompts([injectionPrompt]);
    console.log(`${REGION_SCAN_CONSTANTS.LOG_PREFIX} 已刷新区域扫描注入`, reason || 'unknown', region);
  }

  async function init() {
    if (typeof waitGlobalInitialized === 'function') {
      await waitGlobalInitialized('Mvu');
    }

    refreshRegionInjection('init');

    if (typeof eventOn === 'function') {
      eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, () => {
        refreshRegionInjection('variable_update');
      });

      eventOn(tavern_events.GENERATION_AFTER_COMMANDS, () => {
        refreshRegionInjection('generation_after_commands');
      });

      eventOn(tavern_events.CHAT_CHANGED, () => {
        setTimeout(() => {
          refreshRegionInjection('chat_changed');
        }, 0);
      });
    }
  }

  init().catch(error => {
    console.error(`${REGION_SCAN_CONSTANTS.LOG_PREFIX} 初始化失败`, error);
  });

  $(window).on('pagehide', () => {
    removeRegionInjection();
  });
});
