<template>
  <div class="scircle-root">
    <scroll-list ref="list">
      <!-- 顶部：两行5列广告组件（样式参考 /home/resource 男色选中态） -->
      <dx-resource-ads
        class="px-1.5"
        :items="props.data?.ads ?? props.data?.rank_list ?? []"
        ad-key="images"
        ad-name="同圈"
      />

      <!-- 主视觉：tq.png（图内自带头像等元素） -->
      <div class="scircle-banner px-1.5">
        <img class="scircle-banner-img" src="~/assets/image/tq.png" alt="同圈匹配" />
        <div v-if="isMatching" class="scircle-matching-text">快速匹配中…</div>
      </div>

      <!-- 底部按钮区 -->
      <div v-if="!isMatching" class="scircle-match px-1.5">
        <button class="scircle-start" type="button" :disabled="!canStartMatch" @click="onStartMatch">
          <svg
            class="scircle-start-icon"
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.9374 11.6702C15.4348 0.947505 2.08505 3.45738 2.54941 15.8937C2.80605 22.7251 9.79786 25.8691 13.423 29.2093C16.9633 32.474 18.4881 33.5724 19.9715 35.0481C21.2282 33.7724 22.9758 32.5949 26.4669 29.2093C30.0262 25.7521 36.7217 22.5326 37.3369 15.8181C38.4805 3.39702 24.2325 1.37779 19.9374 11.6702Z"
              fill="white"
            />
          </svg>
          <span class="scircle-start-text">开始匹配</span>
        </button>
        <div class="scircle-bottom">
          <div class="scircle-left">
            可匹配次数：
            <span class="scircle-count">{{ matchRemainNum }}</span>
            <a class="scircle-recharge" href="javascript:void(0)" @click.prevent="openMatchGoodsPopup">充值</a>
          </div>
          <button class="scircle-right" type="button" @click="openSettings">匹配设置 ></button>
        </div>
        <button class="scircle-help" type="button" @click="onHelp">
          <span>速配说明</span>
          <svg
            class="scircle-help-icon"
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.9998 28.3337C7.63565 28.3337 1.6665 22.3645 1.6665 15.0003C1.6665 7.63614 7.63565 1.66699 14.9998 1.66699C22.364 1.66699 28.3332 7.63614 28.3332 15.0003C28.3332 22.3645 22.364 28.3337 14.9998 28.3337ZM14.9998 22.5003C15.494 22.5003 15.8949 22.3403 16.2032 22.0211C16.5115 21.7012 16.6665 21.3053 16.6665 20.8337C16.6665 20.362 16.5123 19.9736 16.2032 19.6695C15.8948 19.3645 15.494 19.1978 14.9998 19.167C14.3515 19.1978 13.8732 19.487 13.5648 20.0345C13.2565 20.5828 13.2565 21.1303 13.5648 21.6787C13.8732 22.2262 14.3515 22.5003 14.9998 22.5003ZM16.2765 17.0561C16.2765 16.9603 16.2432 16.6853 16.2473 16.7245C16.2132 16.3778 16.259 16.0695 16.449 15.772C16.5873 15.5545 16.8015 15.3503 17.1215 15.1612C19.0032 14.0495 19.6915 12.8111 19.6523 11.5228C19.594 9.59282 18.1723 7.69866 15.089 7.67115C12.5115 7.64698 10.8173 8.89198 10.4165 11.2295C10.3692 11.5523 10.45 11.8808 10.6416 12.1449C10.8332 12.4089 11.1204 12.5876 11.442 12.6428C11.7636 12.6979 12.0939 12.6252 12.3626 12.4401C12.6312 12.2549 12.8169 11.9721 12.8798 11.652C13.0623 10.5937 13.6548 10.1578 15.0657 10.1703C16.6132 10.1845 17.1323 10.8761 17.154 11.597C17.1594 11.7209 17.1262 11.8435 17.059 11.9478C16.8865 12.2578 16.5123 12.6178 15.8507 13.0087C15.1965 13.3945 14.6932 13.8745 14.3398 14.4295C13.7907 15.292 13.6707 16.1453 13.764 17.0128C13.7782 17.1437 13.7765 17.127 13.7765 17.0562C13.7757 17.2208 13.8075 17.384 13.8699 17.5364C13.9324 17.6887 14.0243 17.8273 14.1405 17.944C14.2566 18.0607 14.3947 18.1533 14.5468 18.2165C14.6988 18.2797 14.8618 18.3122 15.0265 18.3122C15.1912 18.3122 15.3542 18.2797 15.5063 18.2165C15.6583 18.1533 15.7964 18.0607 15.9125 17.944C16.0287 17.8273 16.1206 17.6887 16.1831 17.5364C16.2456 17.384 16.2773 17.2208 16.2765 17.0561Z"
              fill="#D81E06"
            />
          </svg>
        </button>
      </div>
    </scroll-list>

    <van-popup v-model:show="showHelp" position="bottom" teleport="body" round closeable>
      <div class="scircle-help-popup">
        <div class="scircle-help-popup-title">速配说明</div>
        <div class="scircle-help-popup-content">
          <template v-if="scircleHelpFaqList.length">
            <div v-for="(item, idx) in scircleHelpFaqList" :key="`${item.qt}-${idx}`" class="scircle-help-faq-item">
              <div class="scircle-help-faq-qt">{{ item.qt }}</div>
              <div class="scircle-help-faq-body">
                <div class="scircle-help-faq-q">{{ item.question }}</div>
                <div class="scircle-help-faq-a">{{ item.answer }}</div>
              </div>
            </div>
          </template>
          <div v-else class="scircle-help-faq-empty">暂无说明</div>
        </div>
        <button class="scircle-help-popup-btn" type="button" @click="showHelp = false">我知道了</button>
      </div>
    </van-popup>

    <van-popup
      v-model:show="showMatchGoodsPopup"
      position="bottom"
      teleport="body"
      round
      closeable
      class="match-goods-popup-van"
    >
      <div class="match-goods-popup">
        <div class="match-goods-popup__header">
          <div class="match-goods-popup__prices">
            <span class="match-goods-popup__price-now">
              {{ selectedMatchGood != null ? `${selectedMatchGood.discount_cion}金币` : '--' }}
            </span>
            <span v-if="selectedMatchGood != null && selectedMatchGood.pay_cion" class="match-goods-popup__price-old">
              {{ selectedMatchGood.pay_cion }}金币
            </span>
          </div>
        </div>

        <div v-if="matchGoodsLoading" class="match-goods-popup__loading">
          <van-loading type="spinner" size="28px" />
        </div>
        <div v-else-if="!matchGoodsList.length" class="match-goods-popup__empty">暂无匹配卡商品</div>
        <div v-else class="match-goods-popup__grid">
          <button
            v-for="g in matchGoodsList"
            :key="g.id"
            type="button"
            class="match-goods-card"
            :class="{ 'is-active': selectedGoodsId === g.id }"
            @click="selectedGoodsId = g.id"
          >
            <span class="match-goods-card__badge">匹配卡</span>
            <img v-lazyLoad="g.img" class="match-goods-card__img" :src="g.img" :alt="g.name" />
            <div class="match-goods-card__name">{{ g.name }}</div>
          </button>
        </div>

        <button
          class="match-goods-popup__buy"
          type="button"
          :disabled="!selectedMatchGood || matchGoodsBuying || matchGoodsLoading"
          @click="onBuyMatchGoods"
        >
          {{ matchGoodsBuying ? '购买中…' : '购买' }}
        </button>
      </div>
    </van-popup>

    <van-popup v-model:show="showSettings" position="bottom" teleport="body" round closeable @closed="resetSettings">
      <div class="scircle-settings">
        <div class="scircle-settings-title">
          {{ settingsStep === 1 ? '第一步 我的资料' : '第二步-我想匹配' }}
        </div>

        <div v-if="settingsStep === 1" class="scircle-settings-body">
          <div class="scircle-settings-scroll">
            <div class="scircle-settings-section">
              <div class="scircle-settings-section-title">个人标签（可多选）</div>
              <div class="scircle-settings-tags">
                <button
                  v-for="item in myProfileTags1"
                  :key="`my-1-${item.id}`"
                  class="scircle-tag"
                  :class="{ 'is-active': isTagSelected(myProfileSelected, item.id) }"
                  type="button"
                  @click="toggleMyTag(item.id)"
                >
                  {{ item.name }}
                </button>
                <span v-if="!myProfileTags1.length" class="scircle-tag-empty">暂无标签</span>
              </div>
            </div>

            <div class="scircle-settings-section">
              <div class="scircle-settings-section-title">个人倾向（可多选）</div>
              <div class="scircle-settings-tags scircle-settings-tags--small">
                <button
                  v-for="item in myProfileTags2"
                  :key="`my-2-${item.id}`"
                  class="scircle-tag scircle-tag--small"
                  :class="{ 'is-active': isTagSelected(myProfileSelected, item.id) }"
                  type="button"
                  @click="toggleMyTag(item.id)"
                >
                  {{ item.name }}
                </button>
                <span v-if="!myProfileTags2.length" class="scircle-tag-empty">暂无倾向</span>
              </div>
            </div>

            <div class="scircle-settings-section">
              <div class="scircle-settings-section-title">个人性癖好（可多选）</div>
              <div class="scircle-settings-tags">
                <button
                  v-for="item in myProfileTags3"
                  :key="`my-3-${item.id}`"
                  class="scircle-tag"
                  :class="{ 'is-active': isTagSelected(myProfileSelected, item.id) }"
                  type="button"
                  @click="toggleMyTag(item.id)"
                >
                  {{ item.name }}
                </button>
                <span v-if="!myProfileTags3.length" class="scircle-tag-empty">暂无标签</span>
              </div>
            </div>

            <div class="scircle-settings-section">
              <div class="scircle-settings-section-title">个人照片</div>
              <div class="scircle-settings-photo">
                <button class="scircle-settings-photo-box" type="button" @click="onPickProfileImage">
                  <img v-if="profileImg" class="scircle-settings-photo-preview" :src="profileImg" alt="个人照片" />
                  <svg
                    v-else
                    class="scircle-settings-photo-cloud"
                    width="34"
                    height="34"
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M716.8 448a204.8 204.8 0 0 0-409.6 0A179.2 179.2 0 0 0 179.2 627.2C179.2 726 259.4 806.4 358.4 806.4h358.4c118.8 0 215.2-96.4 215.2-215.2S835.6 448 716.8 448z"
                      fill="#9B9B9B"
                      opacity="0.35"
                    />
                    <path
                      d="M512 364.8c-9.4 0-17.1 7.7-17.1 17.1v222.1l-61.8-61.8c-6.7-6.7-17.5-6.7-24.2 0s-6.7 17.5 0 24.2l91.2 91.2c3.2 3.2 7.6 5 12.1 5s8.9-1.8 12.1-5l91.2-91.2c6.7-6.7 6.7-17.5 0-24.2s-17.5-6.7-24.2 0l-61.8 61.8V381.9c0-9.4-7.7-17.1-17.1-17.1z"
                      fill="#9B9B9B"
                    />
                  </svg>
                  <div class="scircle-settings-photo-text">
                    上传
                    <br />
                    不大于2M
                  </div>
                </button>
                <input
                  ref="profileImageInputRef"
                  class="scircle-hidden-input"
                  type="file"
                  accept="image/*"
                  @change="onProfileImageChange"
                />
              </div>
            </div>

            <div class="scircle-settings-section">
              <div class="scircle-settings-voice-head">
                <div class="scircle-settings-section-title scircle-settings-voice-title">个人语音（可选）</div>
                <button
                  v-if="profileVoice"
                  type="button"
                  class="scircle-settings-voice-delete"
                  @click="onVoiceDeleteRerecord"
                >
                  删除重录
                </button>
              </div>

              <div
                v-if="profileVoice"
                class="scircle-settings-voice-player"
                role="button"
                tabindex="0"
                @click="toggleProfileVoicePlay"
              >
                <span class="scircle-settings-voice-player-wave" aria-hidden="true">
                  <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M11 1v16M7 4.5v9M15 4.5v9M3 7.5v3M19 7.5v3"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </span>
                <span class="scircle-settings-voice-player-dur">{{ profileVoiceDurationDisplay }}</span>
                <audio
                  ref="profileVoiceAudioRef"
                  :src="profileVoice"
                  class="scircle-hidden-input"
                  preload="metadata"
                  @play="voicePlaying = true"
                  @pause="voicePlaying = false"
                  @ended="voicePlaying = false"
                />
              </div>

              <template v-else>
                <div class="scircle-settings-voice-actions">
                  <!-- <button class="scircle-settings-voice-btn" type="button" @click="onPickProfileVoice">上传语音</button> -->
                  <span class="scircle-settings-voice-tip">{{ isUploadingVoice ? '语音上传中...' : '' }}</span>
                </div>
                <input
                  ref="profileVoiceInputRef"
                  class="scircle-hidden-input"
                  type="file"
                  accept="audio/*"
                  @change="onProfileVoiceChange"
                />
              </template>
            </div>
          </div>

          <div class="scircle-settings-footer">
            <button
              v-if="!profileVoice && !isUploadingVoice"
              class="scircle-settings-primary"
              type="button"
              @touchstart.prevent="onRecordStart"
              @touchmove.prevent="onRecordMove"
              @touchend.prevent="onRecordEnd"
              @touchcancel.prevent="onRecordEnd"
              @mousedown.prevent="onRecordStart"
              @mousemove.prevent="onRecordMouseMove"
              @mouseup.prevent="onRecordEnd"
              @mouseleave.prevent="onRecordEnd"
            >
              <svg
                class="scircle-settings-record-icon"
                width="40"
                height="46"
                viewBox="0 0 40 46"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.1187 29.7884C18.1164 29.7884 16.2297 28.892 14.8059 27.2648C13.382 25.6376 12.5977 23.4809 12.5977 21.1929V11.5701C12.5977 9.28175 13.382 7.1255 14.8059 5.49827C16.2297 3.87104 18.1168 2.97461 20.1187 2.97461H20.1262C24.2691 2.97461 27.6398 6.83041 27.6398 11.5701V21.1929C27.6398 23.4813 26.8555 25.6376 25.4316 27.2648C24.0078 28.8925 22.1207 29.7884 20.1187 29.7884ZM20.1187 6.0755C17.4676 6.0755 15.3105 8.54068 15.3105 11.5706V21.1934C15.3105 24.2233 17.4676 26.6884 20.1187 26.6884C22.7699 26.6884 24.927 24.2233 24.927 21.1934V11.5701C24.927 8.54023 22.7734 6.07506 20.1262 6.07506H20.1187V6.0755Z"
                  fill="white"
                />
                <path
                  d="M20.1188 34.9445C18.3926 34.9445 16.7141 34.5548 15.1305 33.7856C13.6035 33.0441 12.2313 31.9847 11.0512 30.636C9.87109 29.2874 8.94375 27.7186 8.29531 25.974C7.62266 24.1642 7.28125 22.2459 7.28125 20.2731C7.28125 19.4169 7.88867 18.7227 8.63789 18.7227C9.38711 18.7227 9.99453 19.4169 9.99453 20.2731C9.99453 26.6535 14.5363 31.8441 20.1191 31.8441C25.702 31.8441 30.2438 26.6535 30.2438 20.2731C30.2438 19.4169 30.8512 18.7227 31.6004 18.7227C32.3496 18.7227 32.957 19.4169 32.957 20.2731C32.957 22.2459 32.616 24.1642 31.943 25.974C31.2941 27.7191 30.3672 29.2874 29.1871 30.636C28.007 31.9847 26.6344 33.0445 25.1078 33.7856C23.5234 34.5548 21.8449 34.9445 20.1188 34.9445Z"
                  fill="white"
                />
                <path
                  d="M20.1188 42.6558C19.3696 42.6558 18.7622 41.9616 18.7622 41.1054V33.3942C18.7622 32.5379 19.3696 31.8438 20.1188 31.8438C20.8681 31.8438 21.4755 32.5379 21.4755 33.3942V41.1058C21.4755 41.9616 20.8681 42.6558 20.1188 42.6558Z"
                  fill="white"
                />
                <path
                  d="M17.4162 19.6974C16.667 19.6974 16.0596 19.0032 16.0596 18.1469V12.0094C16.0596 11.1532 16.667 10.459 17.4162 10.459C18.1654 10.459 18.7729 11.1532 18.7729 12.0094V18.1474C18.7725 19.0036 18.1654 19.6974 17.4162 19.6974Z"
                  fill="#F7B52C"
                />
              </svg>
              <span class="scircle-settings-record-text">按住录制</span>
            </button>
            <button
              class="scircle-settings-next"
              type="button"
              :disabled="isSavingStep1"
              :class="{ 'scircle-settings-next--solo': profileVoice || isUploadingVoice }"
              @click="onStepOneNext"
            >
              {{ isSavingStep1 ? '提交中...' : '下一步' }}
            </button>
          </div>
        </div>

        <div v-else class="scircle-settings-body">
          <div class="scircle-settings-scroll">
            <div class="scircle-settings-section">
              <div class="scircle-settings-section-title">他的标签（可多选）</div>
              <div class="scircle-settings-tags">
                <button
                  v-for="item in expectProfileTags1"
                  :key="`expect-1-${item.id}`"
                  class="scircle-tag"
                  :class="{ 'is-active': isTagSelected(expectProfileSelected, item.id) }"
                  type="button"
                  @click="toggleExpectTag(item.id)"
                >
                  {{ item.name }}
                </button>
                <span v-if="!expectProfileTags1.length" class="scircle-tag-empty">暂无标签</span>
              </div>
            </div>

            <div class="scircle-settings-section">
              <div class="scircle-settings-section-title">他的倾向（可多选）</div>
              <div class="scircle-settings-tags scircle-settings-tags--small">
                <button
                  v-for="item in expectProfileTags2"
                  :key="`expect-2-${item.id}`"
                  class="scircle-tag scircle-tag--small"
                  :class="{ 'is-active': isTagSelected(expectProfileSelected, item.id) }"
                  type="button"
                  @click="toggleExpectTag(item.id)"
                >
                  {{ item.name }}
                </button>
                <span v-if="!expectProfileTags2.length" class="scircle-tag-empty">暂无倾向</span>
              </div>
            </div>

            <div class="scircle-settings-section">
              <div class="scircle-settings-section-title">他的性癖好（可多选）</div>
              <div class="scircle-settings-tags">
                <button
                  v-for="item in expectProfileTags3"
                  :key="`expect-3-${item.id}`"
                  class="scircle-tag"
                  :class="{ 'is-active': isTagSelected(expectProfileSelected, item.id) }"
                  type="button"
                  @click="toggleExpectTag(item.id)"
                >
                  {{ item.name }}
                </button>
                <span v-if="!expectProfileTags3.length" class="scircle-tag-empty">暂无标签</span>
              </div>
            </div>
          </div>

          <div class="scircle-settings-footer">
            <button class="scircle-settings-next" type="button" :disabled="isSavingStep2" @click="onStepTwoDone">
              {{ isSavingStep2 ? '提交中...' : '完成' }}
            </button>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 必须挂到 body，否则 z-index 受祖先层叠上下文限制，会被 teleport 的 van-popup 盖住 -->
    <Teleport to="body">
      <div v-if="showRecordOverlay" class="scircle-record-overlay">
        <!-- 结构对齐设计稿：上区暗色 + 波形气泡与右侧取消；中区「松开发送」；下区浅灰弧形 + 麦克风 -->
        <div class="scircle-record-dim">
          <div class="scircle-record-actions" :class="{ 'is-cancel-mode': isRecordCancel }">
            <div class="scircle-record-voice" :class="{ 'is-cancel': isRecordCancel }">
              <div class="scircle-record-bars">
                <span class="bar" />
                <span class="bar" />
                <span class="bar" />
                <span class="bar" />
                <span class="bar" />
              </div>
            </div>

            <div class="scircle-record-cancel-wrap">
              <svg
                v-if="isRecordCancel"
                class="scircle-record-cancel-arc-text"
                viewBox="0 0 120 36"
                aria-hidden="true"
              >
                <defs>
                  <path :id="recordCancelArcPathId" d="M 8 28 Q 60 4 112 28" fill="none" />
                </defs>
                <text class="scircle-record-cancel-arc-fill" text-anchor="middle">
                  <textPath :href="`#${recordCancelArcPathId}`" startOffset="50%">松手 取消</textPath>
                </text>
              </svg>
              <div ref="cancelRef" class="scircle-record-cancel" :class="{ 'is-active': isRecordCancel }">取消</div>
            </div>
          </div>
          <div class="scircle-record-tip">松开发送</div>
        </div>
        <div class="scircle-record-arch" aria-hidden="true">
          <svg class="scircle-record-mic-icon" width="56" height="56" viewBox="0 0 56 56" fill="none">
            <path
              d="M28 36c4.42 0 8-3.58 8-8V18c0-4.42-3.58-8-8-8s-8 3.58-8 8v10c0 4.42 3.58 8 8 8z"
              stroke="currentColor"
              stroke-width="2.2"
            />
            <path d="M18 26v2c0 5.52 4.48 10 10 10s10-4.48 10-10v-2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
            <path d="M28 40v6M22 46h12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
            <path
              d="M38 22c0-5.52-4.48-10-10-10M18 22c0-5.52 4.48-10 10-10"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              opacity="0.45"
            />
          </svg>
        </div>
      </div>
    </Teleport>

    <van-popup
      v-model:show="showMatchPopup"
      teleport="body"
      :close-on-click-overlay="false"
      :closeable="false"
      :show-toolbar="false"
      class="tq-match-popup"
    >
      <div class="tq-flip" :class="{ 'is-detail': matchView === 'detail' }">
        <div class="tq-flip-inner">
          <!-- 第一层：匹配成功（6选1） -->
          <div class="tq-face tq-face-front">
            <div class="tq-success" :style="{ backgroundImage: `url(${successBgUrl})` }">
              <div class="tq-success-title">点击任意图片可查看用户详细信息</div>

              <div class="tq-grid">
                <button
                  v-for="(item, idx) in matchItems"
                  :key="idx"
                  class="tq-grid-item"
                  type="button"
                  @click="openMatchDetail(idx)"
                >
                  <img class="tq-grid-img" :src="item.cover" alt="匹配结果" />
                </button>
              </div>
            </div>
          </div>

          <!-- 第二层：大图详情 -->
          <div class="tq-face tq-face-back">
            <div class="tq-detail" :style="{ backgroundImage: `url(${activeDetailBg})` }">
              <div class="tq-detail-top">
                <button class="tq-detail-back" type="button" @click="backToMatchGrid">‹</button>
                <div class="tq-detail-name">{{ activeMatchItem.nickname || '匿名用户' }}</div>
                <div class="tq-detail-right" />
              </div>

              <div class="tq-detail-body">
                <div class="tq-detail-match">{{ activeMatchLineText }}</div>

                <div class="tq-detail-tags">
                  <div class="tq-detail-tags-scroll">
                    <span v-for="(tag, i) in activeMatchItem.tags" :key="`${tag}-${i}`" class="tq-pill">#{{ tag }}</span>
                    <span v-if="!activeMatchItem.tags.length" class="tq-pill">#暂无标签</span>
                  </div>
                </div>

                <div v-if="activeMatchItem.voice_url" class="tq-voice">
                  <button class="tq-voice-play" type="button" aria-label="播放语音" @click="toggleMatchVoicePlay">
                    <span v-if="!matchVoicePlaying" class="tq-voice-play-icon tq-voice-play-icon--play" />
                    <span v-else class="tq-voice-play-icon tq-voice-play-icon--pause" />
                  </button>
                  <div class="tq-voice-bars" :class="{ 'is-playing': matchVoicePlaying }">
                    <span class="bar" />
                    <span class="bar" />
                    <span class="bar" />
                    <span class="bar" />
                    <span class="bar" />
                    <span class="bar" />
                    <span class="bar" />
                    <span class="bar" />
                  </div>
                  <div class="tq-voice-dur">{{ activeMatchItem.voice_duration || '0"' }}</div>
                  <audio
                    :key="`match-voice-${activeMatchItem.uid}-${activeMatchItem.voice_url}`"
                    ref="matchDetailAudioRef"
                    class="tq-voice-audio"
                    :src="activeMatchItem.voice_url"
                    preload="metadata"
                    @play="matchVoicePlaying = true"
                    @pause="matchVoicePlaying = false"
                    @ended="matchVoicePlaying = false"
                  />
                </div>
                <div v-else class="tq-voice-empty">对方暂无语音</div>
              </div>

              <div class="tq-detail-footer">
                <button class="tq-btn tq-btn-ghost" type="button" @click="closeMatchPopup">返回匹配</button>
                <button class="tq-btn tq-btn-primary" type="button" @click="goChat">聊天</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { computed, useId, watch } from 'vue'
import successBgUrl from '~/assets/image/success-bg.png'
import tqItemUrl from '~/assets/image/tq-item.png'

const recordCancelArcPathId = useId()

const props = defineProps<{
  data: any
}>()
const listRef = useTemplateRef('list')
const { scrollTop } = useScrollTop(listRef)
const __ = useNuxtApp()

/** 从接口/axios 错误对象取出提示文案 */
function scircleErrMsg(err: unknown): string {
  if (err == null) return '请求失败'
  if (typeof err === 'string') return err
  const e = err as Record<string, any>
  if (e.msg != null && String(e.msg).trim() !== '') return String(e.msg)
  if (e.message != null && String(e.message).trim() !== '') return String(e.message)
  const ax = e.response?.data
  if (ax && typeof ax === 'object' && ax.msg != null && String(ax.msg).trim() !== '') return String(ax.msg)
  if (e instanceof Error && e.message) return e.message
  return '请求失败'
}

/** 开发环境：进入同圈 tab 后打印首页相关接口返回，便于对照「可匹配次数」等字段 */
const scircleDebug = import.meta.env.DEV && import.meta.client

// 匹配首页配置
interface TalkHomeData {
  info: Record<string, any>
  online_count: number
  readme: any[]
}
interface MatchItem {
  uid: string | number
  nickname: string
  avatar: string
  cover: string
  /** 列表项 /usersmatch/match 的 score（数字），用于 get_match_info、submit 等入参 */
  match_percent: number
  /** 详情 /usersmatch/get_match_info 的 score（常为整句文案）；有则详情区整行展示 */
  match_line_text: string
  tags: string[]
  /**
   * 对方语音 URL（详情接口当前不返回语音字段，此处预留；将来可接 voice / voice_url 等）
   */
  voice_url: string
  voice_duration: string
}
interface MatchTagItem {
  id: number | string
  name: string
  type: number
  status: number
}
const talkHomeData = ref<TalkHomeData>({
  info: {},
  online_count: 0,
  readme: []
})

// 可用匹配次数：只来自 myprofile（不与 readme/talkConf 混用）
const myProfileMatchNum = ref(0)

/** 可匹配次数展示（无字段时兜底 0，非 3） */
const matchRemainNum = computed(() => Number(myProfileMatchNum.value ?? 0))
const canStartMatch = computed(() => matchRemainNum.value > 0)

type ScircleReadmeFaqItem = { qt: string; question: string; answer: string }

function normalizeReadmeFaqList(readme: any[]): ScircleReadmeFaqItem[] {
  if (!Array.isArray(readme) || !readme.length) return []
  const out: ScircleReadmeFaqItem[] = []
  for (const item of readme) {
    if (item == null) continue
    if (typeof item === 'string') {
      const t = item.trim()
      if (t) out.push({ qt: `Q${out.length + 1}`, question: '', answer: item })
      continue
    }
    if (typeof item === 'object') {
      const question = String(item.question ?? item.title ?? '')
      const answer = String(item.answer ?? item.content ?? '')
      if (!question.trim() && !answer.trim()) continue
      const qtRaw = item.qt
      const qt = qtRaw != null && String(qtRaw).trim() !== '' ? String(qtRaw) : `Q${out.length + 1}`
      out.push({ qt, question, answer })
    }
  }
  return out
}

/** 仅接口 readme（myprofile / talk/conf 的 data.readme），无兜底数据 */
const scircleHelpFaqList = computed(() => normalizeReadmeFaqList(talkHomeData.value.readme))

async function fetchTalkHome() {
  try {
    // 先拉「我的资料」：match_num 以此接口为准
    const myProfileRes = await __.$Api.Community.usersmatchMyprofile().catch(e => {
      if (scircleDebug) console.warn('[scircle] POST /api/usersmatch/myprofile 失败', e)
      __.$Toast(scircleErrMsg(e))
      return null
    })

    // 打印 myprofile 返回（你说的“书库”这里先按接口返回整包/核心 data 打印）
    if (scircleDebug) {
      console.log(
        '%c[scircle] ① POST /api/usersmatch/myprofile 整包（解密后）',
        'font-weight:bold;color:#1677ff',
        myProfileRes
      )
      console.log('[scircle] ① data 字段：', myProfileRes?.data)
      console.log('[scircle] ① match_num（新字段）:', myProfileRes?.data?.match_num)
    }

    // 再拉「我想匹配」等其它配置
    const expectProfileRes = await __.$Api.Community.usersmatchMyExpectProfile().catch(e => {
      if (scircleDebug) console.warn('[scircle] POST /api/usersmatch/myexpectprofile 失败', e)
      __.$Toast(scircleErrMsg(e))
      return null
    })

    if (scircleDebug) {
      console.log(
        '%c[scircle] ② POST /api/usersmatch/myexpectprofile 整包（解密后）',
        'font-weight:bold;color:#1677ff',
        expectProfileRes
      )
      console.log('[scircle] ② data 字段：', expectProfileRes?.data)
    }

    const myProfile = myProfileRes?.data || {}
    const expectProfile = expectProfileRes?.data || {}
    myProfileMatchNum.value = Number(myProfile?.match_num ?? 0)
    talkHomeData.value = {
      info: {
        ...myProfile,
        expect: expectProfile,
        match_num: myProfileMatchNum.value
      },
      online_count: Number(myProfile?.online_count ?? 0),
      readme: Array.isArray(myProfile?.readme) ? myProfile.readme : []
    }

    // readme 为空时再补一次 talk/conf，但不要覆盖 myprofile 的 match_num（可用匹配次数以 myprofile 为准）
    if (!talkHomeData.value.readme.length) {
      const res = await __.$Api.Community.talkConf().catch(e => {
        if (scircleDebug) console.warn('[scircle] POST /api/talk/conf 失败', e)
        __.$Toast(scircleErrMsg(e))
        return null
      })
      if (scircleDebug && res) {
        console.log(
          '%c[scircle] ③ POST /api/talk/conf（readme 空且 match_num 为 0 时补充拉取）',
          'font-weight:bold;color:#07c160',
          res
        )
        console.log('[scircle] ③ data：', res?.data)
      }
      if (res?.data) {
        const cur = talkHomeData.value
        const next = res.data as TalkHomeData
        // 各用各的：readme/online_count 用 talk/conf；次数等 info 字段用 myprofile
        talkHomeData.value = {
          ...cur,
          online_count: cur.online_count || Number(next?.online_count ?? 0),
          readme: cur.readme?.length ? cur.readme : next.readme
        }
      }
    }

    if (scircleDebug) {
      console.log('%c[scircle] 最终 talkHomeData（页面绑定）', 'font-weight:bold;color:#333', talkHomeData.value)
      console.log('[scircle] 可用匹配次数 myProfileMatchNum =', myProfileMatchNum.value)
    }
  } catch (error) {
    console.error('获取同圈配置失败:', error)
    __.$Toast(scircleErrMsg(error))
  }
}

onMounted(() => {
  fetchTalkHome()
})

/** 匹配卡商品（接口字段 pay_cion / discount_cion 与后端一致） */
interface MatchGoodsItem {
  id: number
  name: string
  img: string
  num: number
  pay_cion: number
  discount_cion: number
  status?: number
}

const showMatchGoodsPopup = ref(false)
const matchGoodsList = ref<MatchGoodsItem[]>([])
const matchGoodsLoading = ref(false)
const matchGoodsBuying = ref(false)
const selectedGoodsId = ref<number | null>(null)

const selectedMatchGood = computed(() => {
  const id = selectedGoodsId.value
  if (id == null) return null
  return matchGoodsList.value.find(g => g.id === id) ?? null
})

async function loadMatchGoods() {
  matchGoodsLoading.value = true
  try {
    const res = await __.$Api.Community.matchGoods({})
    const raw = res?.data
    const list = Array.isArray(raw) ? raw : []
    matchGoodsList.value = list
      .filter((g: MatchGoodsItem) => g.status !== 0)
      .map((g: any) => ({
        id: Number(g.id),
        name: String(g.name ?? ''),
        img: String(g.img ?? ''),
        num: Number(g.num ?? 0),
        pay_cion: Number(g.pay_cion ?? 0),
        discount_cion: Number(g.discount_cion ?? 0),
        status: g.status
      }))
    if (matchGoodsList.value.length) {
      const exists = matchGoodsList.value.some(g => g.id === selectedGoodsId.value)
      if (!exists) selectedGoodsId.value = matchGoodsList.value[0].id
    } else {
      selectedGoodsId.value = null
    }
  } catch (e) {
    console.error('[scircle] match_goods 失败', e)
    __.$Toast(scircleErrMsg(e))
    matchGoodsList.value = []
    selectedGoodsId.value = null
  } finally {
    matchGoodsLoading.value = false
  }
}

async function openMatchGoodsPopup() {
  showMatchGoodsPopup.value = true
  await loadMatchGoods()
}

async function onBuyMatchGoods() {
  const g = selectedMatchGood.value
  if (!g || matchGoodsBuying.value) return
  matchGoodsBuying.value = true
  try {
    await __.$Api.Community.buyMatchGoods({ goods_id: String(g.id) })
    showMatchGoodsPopup.value = false
    await fetchTalkHome()
  } catch (e) {
    console.error('[scircle] buy_match_goods 失败', e)
    __.$Toast(scircleErrMsg(e))
  } finally {
    matchGoodsBuying.value = false
  }
}

const showHelp = ref(false)
const isMatching = ref(false)
const showSettings = ref(false)
const settingsStep = ref<1 | 2>(1)
const showRecordOverlay = ref(false)
const isRecordCancel = ref(false)
const cancelRef = useTemplateRef<HTMLElement>('cancelRef')
const isMouseDown = ref(false)
const showMatchPopup = ref(false)
const matchView = ref<'grid' | 'detail'>('grid')
const selectedMatchIndex = ref(0)
const router = useRouter()
const myProfileGroups = ref<Record<number, MatchTagItem[]>>({ 1: [], 2: [], 3: [] })
const expectProfileGroups = ref<Record<number, MatchTagItem[]>>({ 1: [], 2: [], 3: [] })
const myProfileSelected = ref<string[]>([])
const expectProfileSelected = ref<string[]>([])
const profileImg = ref('')
const profileVoice = ref('')
const profileVoiceDurationSec = ref<number | null>(null)
const profileVoiceAudioRef = ref<HTMLAudioElement | null>(null)
const voicePlaying = ref(false)
const profileImageInputRef = ref<HTMLInputElement | null>(null)
const profileVoiceInputRef = ref<HTMLInputElement | null>(null)
const isSavingStep1 = ref(false)
const isSavingStep2 = ref(false)
const isUploadingImage = ref(false)
const isUploadingVoice = ref(false)
const mediaRecorderRef = ref<MediaRecorder | null>(null)
const mediaStreamRef = ref<MediaStream | null>(null)
const recordChunksRef = ref<Blob[]>([])
const recordStartTsRef = ref(0)
const isRecordInitializing = ref(false)
/** 防止松手早于 getUserMedia 完成时仍创建录音 */
const recordGenRef = ref(0)

const myProfileTags1 = computed(() => myProfileGroups.value[1] || [])
const myProfileTags2 = computed(() => myProfileGroups.value[2] || [])
const myProfileTags3 = computed(() => myProfileGroups.value[3] || [])
const expectProfileTags1 = computed(() => expectProfileGroups.value[1] || [])
const expectProfileTags2 = computed(() => expectProfileGroups.value[2] || [])
const expectProfileTags3 = computed(() => expectProfileGroups.value[3] || [])

function probeVoiceDurationFromUrl(url: string): Promise<number> {
  return new Promise(resolve => {
    const a = new Audio()
    a.preload = 'metadata'
    a.src = url
    a.onloadedmetadata = () => {
      const d = Math.round(a.duration)
      resolve(Number.isFinite(d) && d > 0 ? d : 0)
    }
    a.onerror = () => resolve(0)
  })
}

function pickAudioRecorderMime(): string {
  if (typeof MediaRecorder === 'undefined') return ''
  const list = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus']
  for (const t of list) {
    if (MediaRecorder.isTypeSupported(t)) return t
  }
  return ''
}

async function getAudioDurationFromFile(file: File): Promise<number> {
  const u = URL.createObjectURL(file)
  try {
    return await new Promise(resolve => {
      const a = new Audio()
      a.src = u
      a.onloadedmetadata = () => {
        const d = Math.round(a.duration)
        resolve(Number.isFinite(d) && d > 0 ? d : 0)
      }
      a.onerror = () => resolve(0)
    })
  } finally {
    URL.revokeObjectURL(u)
  }
}

/** 语音走 R2 分片通道；imgUpload 只收图片，音频会提示「格式不支持」 */
async function uploadVoiceToServer(file: File): Promise<string> {
  const url = (await __.$Api.uploadVideo(file)) as unknown as string
  return String(url || '')
}

const profileVoiceDurationDisplay = computed(() => {
  const s = profileVoiceDurationSec.value
  if (s == null || s <= 0) return '0"'
  return `${Math.min(599, s)}"`
})

watch(
  () => profileVoice.value,
  url => {
    if (!url) {
      profileVoiceDurationSec.value = null
      voicePlaying.value = false
      return
    }
    void probeVoiceDurationFromUrl(url).then(sec => {
      if (sec > 0) profileVoiceDurationSec.value = sec
    })
  }
)

function normalizeTagId(id: number | string | null | undefined) {
  return String(id ?? '')
}

function normalizeTagGroup(list: any[]): MatchTagItem[] {
  if (!Array.isArray(list)) return []
  return list.map((item: any, index: number) => ({
    id: item?.id ?? index,
    name: item?.name ?? item?.title ?? '',
    type: Number(item?.type ?? 0),
    status: Number(item?.status ?? 0)
  }))
}

function parseProfileGroups(data: any) {
  return {
    groups: {
      1: normalizeTagGroup(data?.['1'] || []),
      2: normalizeTagGroup(data?.['2'] || []),
      3: normalizeTagGroup(data?.['3'] || [])
    },
    selected: [
      ...(data?.['1'] || []),
      ...(data?.['2'] || []),
      ...(data?.['3'] || [])
    ]
      .filter((item: any) => Number(item?.status ?? 0) === 1)
      .map((item: any) => normalizeTagId(item?.id)),
    img: String(data?.img ?? ''),
    voice: String(data?.voice ?? '')
  }
}

function isTagSelected(selected: string[], id: number | string) {
  return selected.includes(normalizeTagId(id))
}

function toggleTag(selected: string[], id: number | string) {
  const key = normalizeTagId(id)
  const next = [...selected]
  const idx = next.indexOf(key)
  if (idx >= 0) {
    next.splice(idx, 1)
  } else {
    next.push(key)
  }
  return next
}

function toggleMyTag(id: number | string) {
  myProfileSelected.value = toggleTag(myProfileSelected.value, id)
}

function toggleExpectTag(id: number | string) {
  expectProfileSelected.value = toggleTag(expectProfileSelected.value, id)
}

async function loadSettingsProfiles() {
  const [myProfileRes, expectProfileRes] = await Promise.all([
    __.$Api.Community.usersmatchMyprofile().catch(e => {
      __.$Toast(scircleErrMsg(e))
      return null
    }),
    __.$Api.Community.usersmatchMyExpectProfile().catch(e => {
      __.$Toast(scircleErrMsg(e))
      return null
    })
  ])
  const myParsed = parseProfileGroups(myProfileRes?.data || {})
  const expectParsed = parseProfileGroups(expectProfileRes?.data || {})
  myProfileGroups.value = myParsed.groups
  expectProfileGroups.value = expectParsed.groups
  myProfileSelected.value = myParsed.selected
  expectProfileSelected.value = expectParsed.selected
  profileImg.value = myParsed.img
  profileVoice.value = myParsed.voice
}

function onPickProfileImage() {
  if (isUploadingImage.value) return
  profileImageInputRef.value?.click()
}

async function onProfileImageChange(event: Event) {
  const input = event.target as HTMLInputElement | null
  const file = input?.files?.[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    __.$Toast('图片不能大于2M')
    if (input) input.value = ''
    return
  }
  try {
    isUploadingImage.value = true
    const compressed = await __.$ImageCompression.compressor(file)
    const url = (await __.$Api.uploadImage({ file: compressed, useCompress: false })) as unknown as string
    profileImg.value = String(url || '')
    __.$Toast('图片上传成功')
  } catch (error) {
    console.error('图片上传失败:', error)
    __.$Toast(scircleErrMsg(error))
  } finally {
    isUploadingImage.value = false
    if (input) input.value = ''
  }
}

function onPickProfileVoice() {
  if (isUploadingVoice.value) return
  profileVoiceInputRef.value?.click()
}

async function onProfileVoiceChange(event: Event) {
  const input = event.target as HTMLInputElement | null
  const file = input?.files?.[0]
  if (!file) return
  try {
    isUploadingVoice.value = true
    const dur = await getAudioDurationFromFile(file)
    const url = await uploadVoiceToServer(file)
    profileVoice.value = url
    if (dur > 0) profileVoiceDurationSec.value = dur
    __.$Toast('语音上传成功')
  } catch (error) {
    console.error('语音上传失败:', error)
    __.$Toast(scircleErrMsg(error))
  } finally {
    isUploadingVoice.value = false
    if (input) input.value = ''
  }
}

function onVoiceDeleteRerecord() {
  const el = profileVoiceAudioRef.value
  if (el) {
    el.pause()
    el.removeAttribute('src')
    el.load()
  }
  voicePlaying.value = false
  profileVoice.value = ''
  profileVoiceDurationSec.value = null
}

function toggleProfileVoicePlay() {
  const el = profileVoiceAudioRef.value
  if (!el || !profileVoice.value) return
  if (voicePlaying.value) {
    el.pause()
  } else {
    void el.play().catch(() => {})
  }
}

const matchItems = ref<MatchItem[]>([])
const matchDetailAudioRef = useTemplateRef<HTMLAudioElement>('matchDetailAudioRef')
const matchVoicePlaying = ref(false)

const activeMatchItem = computed<MatchItem>(() => {
  return matchItems.value[selectedMatchIndex.value] || {
    uid: '0',
    nickname: '',
    avatar: '',
    cover: tqItemUrl,
    match_percent: 0,
    match_line_text: '',
    tags: [],
    voice_url: '',
    voice_duration: '0"'
  }
})
const activeDetailBg = computed(() => activeMatchItem.value.cover || tqItemUrl)

/** 详情区匹配文案：优先 get_match_info 返回的整句 score，否则用列表数值拼一句 */
const activeMatchLineText = computed(() => {
  const m = activeMatchItem.value
  const line = m.match_line_text?.trim()
  if (line) return line
  return `匹配度${m.match_percent ?? 0}%，你俩超级搭哟！`
})

/** 从接口对象解析语音文件 URL（字段名按后端可能取值兼容） */
function voiceUrlFromApiItem(item: any): string {
  const u = item?.voice ?? item?.voice_url ?? item?.audio_url ?? item?.audio ?? item?.voice_file ?? ''
  return typeof u === 'string' ? u.trim() : String(u || '').trim()
}

/** 展示用时长文案，如 12" */
function voiceDurationLabelFromApi(item: any): string {
  const v = item?.voice_duration ?? item?.voice_len ?? item?.voice_time ?? item?.duration
  if (v == null || v === '') return '0"'
  if (typeof v === 'number' && Number.isFinite(v)) return `${Math.round(v)}"`
  const s = String(v).trim()
  if (s.includes('"')) return s
  const n = Number(s)
  return Number.isFinite(n) ? `${Math.round(n)}"` : '0"'
}

function normalizeMatchItems(raw: any): MatchItem[] {
  /** 文档约定：/api/usersmatch/match 的 data 即为用户数组 */
  const source = Array.isArray(raw) ? raw : raw?.list || raw?.items || raw?.users || raw?.data || []
  if (!Array.isArray(source)) return []
  return source.map((item: any, index: number) => ({
    uid: item?.uid ?? item?.id ?? index,
    nickname: item?.nickname ?? item?.name ?? '匿名用户',
    avatar: item?.avatar ?? item?.avatar_url ?? item?.thumb ?? '',
    cover: item?.cover ?? item?.thumb ?? item?.avatar ?? item?.avatar_url ?? tqItemUrl,
    match_percent: Number(item?.match_percent ?? item?.match_score ?? item?.score ?? 0),
    match_line_text: '',
    tags: Array.isArray(item?.tags) ? item.tags : [],
    voice_url: voiceUrlFromApiItem(item),
    voice_duration: voiceDurationLabelFromApi(item)
  }))
}

function stopMatchDetailVoice() {
  matchDetailAudioRef.value?.pause()
  matchVoicePlaying.value = false
}

function toggleMatchVoicePlay() {
  const el = matchDetailAudioRef.value
  const url = activeMatchItem.value.voice_url
  if (!el || !url) return
  if (matchVoicePlaying.value) {
    el.pause()
  } else {
    void el.play().catch(() => {
      __.$Toast('语音播放失败')
    })
  }
}

function onHelp() {
  showHelp.value = true
}

async function onStartMatch() {
  if (!canStartMatch.value) return
  isMatching.value = true
  try {
    let res: any = null
    try {
      res = await __.$Api.Community.usersmatchMatch({})
    } catch (e) {
      __.$Toast(scircleErrMsg(e))
    }
    if (!res) {
      res = await __.$Api.Community.talkMatch({})
    }
    const rows = normalizeMatchItems(res?.data)
    matchItems.value = rows.length
      ? rows.slice(0, 6)
      : Array.from({ length: 6 }).map((_, index) => ({
          uid: index,
          nickname: '匿名用户',
          avatar: '',
          cover: tqItemUrl,
          match_percent: 0,
          match_line_text: '',
          tags: [],
          voice_url: '',
          voice_duration: '0"'
        }))
    selectedMatchIndex.value = 0
    showMatchPopup.value = true
    matchView.value = 'grid'
  } catch (error) {
    console.error('匹配失败:', error)
    __.$Toast(scircleErrMsg(error))
  } finally {
    isMatching.value = false
  }
}

async function openSettings() {
  settingsStep.value = 1
  showSettings.value = true
  try {
    await loadSettingsProfiles()
  } catch (error) {
    console.error('加载匹配标签失败:', error)
    __.$Toast(scircleErrMsg(error))
  }
}

function resetSettings() {
  settingsStep.value = 1
}

async function onStepOneNext() {
  if (isSavingStep1.value) return
  isSavingStep1.value = true
  try {
    await __.$Api.Community.usersmatchUpdateProfile({
      tag_ids: myProfileSelected.value.join(','),
      img: profileImg.value,
      voice: profileVoice.value
    })
    settingsStep.value = 2
  } catch (error) {
    console.error('更新个人资料失败:', error)
    __.$Toast(scircleErrMsg(error))
  } finally {
    isSavingStep1.value = false
  }
}

async function onStepTwoDone() {
  if (isSavingStep2.value) return
  isSavingStep2.value = true
  try {
    await __.$Api.Community.usersmatchUpdateExpectProfile({
      tag_ids: expectProfileSelected.value.join(',')
    })
    showSettings.value = false
  } catch (error) {
    console.error('更新匹配偏好失败:', error)
    __.$Toast(scircleErrMsg(error))
  } finally {
    isSavingStep2.value = false
  }
}

function isInCancelArea(clientX: number, clientY: number) {
  const el = cancelRef.value
  if (!el) return false
  const rect = el.getBoundingClientRect()
  return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom
}

function stopMediaStream() {
  const s = mediaStreamRef.value
  if (s) {
    s.getTracks().forEach(t => t.stop())
    mediaStreamRef.value = null
  }
}

async function onRecordStart(e: TouchEvent | MouseEvent) {
  if (profileVoice.value || isUploadingVoice.value) return
  if (isRecordInitializing.value || (mediaRecorderRef.value && mediaRecorderRef.value.state === 'recording')) return

  const gen = ++recordGenRef.value

  if (e instanceof MouseEvent) {
    isMouseDown.value = true
  }
  showRecordOverlay.value = true
  isRecordCancel.value = false
  if (e instanceof TouchEvent) {
    const t = e.touches?.[0]
    if (t) isRecordCancel.value = isInCancelArea(t.clientX, t.clientY)
  }

  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    showRecordOverlay.value = false
    __.$Toast('当前环境不支持录音')
    return
  }

  isRecordInitializing.value = true
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    if (gen !== recordGenRef.value) {
      stream.getTracks().forEach(t => t.stop())
      return
    }
    mediaStreamRef.value = stream
    recordChunksRef.value = []
    recordStartTsRef.value = Date.now()
    const mime = pickAudioRecorderMime()
    const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream)
    rec.ondataavailable = ev => {
      if (ev.data.size > 0) recordChunksRef.value.push(ev.data)
    }
    rec.start(120)
    mediaRecorderRef.value = rec
  } catch (err) {
    stopMediaStream()
    mediaRecorderRef.value = null
    showRecordOverlay.value = false
    isMouseDown.value = false
    __.$Toast(scircleErrMsg(err) || '无法使用麦克风')
  } finally {
    isRecordInitializing.value = false
  }
}

function onRecordMove(e: TouchEvent) {
  const t = e.touches?.[0]
  if (!t) return
  isRecordCancel.value = isInCancelArea(t.clientX, t.clientY)
}

function onRecordMouseMove(e: MouseEvent) {
  if (!isMouseDown.value) return
  isRecordCancel.value = isInCancelArea(e.clientX, e.clientY)
}

async function onRecordEnd() {
  if (!showRecordOverlay.value) return
  recordGenRef.value++
  const cancelled = isRecordCancel.value
  showRecordOverlay.value = false
  isMouseDown.value = false
  isRecordCancel.value = false

  const rec = mediaRecorderRef.value
  mediaRecorderRef.value = null
  const chunks = [...recordChunksRef.value]
  recordChunksRef.value = []
  stopMediaStream()

  if (!rec || rec.state === 'inactive') {
    return
  }

  await new Promise<void>(resolve => {
    rec.onstop = () => resolve()
    try {
      rec.stop()
    } catch {
      resolve()
    }
  })

  if (cancelled || !chunks.length) {
    return
  }

  const blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' })
  if (blob.size < 80) {
    __.$Toast('录音过短')
    return
  }

  const ext = blob.type.includes('mp4') ? 'm4a' : blob.type.includes('webm') ? 'webm' : 'webm'
  const file = new File([blob], `voice.${ext}`, { type: blob.type || 'audio/webm' })
  const approx = Math.max(1, Math.round((Date.now() - recordStartTsRef.value) / 1000))

  isUploadingVoice.value = true
  try {
    const url = await uploadVoiceToServer(file)
    profileVoice.value = url
    profileVoiceDurationSec.value = approx
    const precise = await probeVoiceDurationFromUrl(profileVoice.value)
    if (precise > 0) profileVoiceDurationSec.value = precise
    __.$Toast('语音上传成功')
  } catch (error) {
    console.error('语音上传失败:', error)
    profileVoice.value = ''
    profileVoiceDurationSec.value = null
    __.$Toast(scircleErrMsg(error))
  } finally {
    isUploadingVoice.value = false
  }
}

function openMatchDetail(idx: number) {
  stopMatchDetailVoice()
  selectedMatchIndex.value = idx
  matchView.value = 'detail'
  void fetchMatchDetail()
}

function backToMatchGrid() {
  stopMatchDetailVoice()
  matchView.value = 'grid'
}

function closeMatchPopup() {
  stopMatchDetailVoice()
  showMatchPopup.value = false
  matchView.value = 'grid'
}

async function fetchMatchDetail() {
  const current = activeMatchItem.value
  if (!current?.uid) return
  try {
    const res = await __.$Api.Community.usersmatchGetMatchInfo({
      uid: current.uid,
      score: current.match_percent
    })
    const detail = res?.data || {}
    const list = Array.isArray(detail?.tags_list) ? detail.tags_list : []
    /** 文档：score 常为整句「匹配度xx%，你俩超级搭哟!」，勿 Number()；数值匹配度沿用列表项 match_percent */
    const scoreRaw = detail?.score
    const matchLineText =
      typeof scoreRaw === 'string' && scoreRaw.trim() !== '' ? scoreRaw.trim() : ''
    const voiceFromDetail = voiceUrlFromApiItem(detail)
    const voiceUrl = voiceFromDetail || current.voice_url
    const durationFromDetail = voiceDurationLabelFromApi(detail)
    const voiceDuration =
      durationFromDetail !== '0"' ? durationFromDetail : current.voice_duration || '0"'
    const nextItem: MatchItem = {
      ...current,
      uid: detail?.uid ?? current.uid,
      nickname: detail?.nickname ?? current.nickname,
      avatar: detail?.avatar_url ?? detail?.avatar ?? detail?.thumb ?? current.avatar,
      cover: detail?.thumb ?? detail?.avatar_url ?? detail?.avatar ?? current.cover,
      match_percent: current.match_percent,
      match_line_text: matchLineText,
      tags: list.map((it: any) => it?.name).filter(Boolean),
      voice_url: voiceUrl,
      voice_duration: voiceDuration
    }
    matchItems.value[selectedMatchIndex.value] = nextItem
  } catch (error) {
    console.error('获取匹配详情失败:', error)
    __.$Toast(scircleErrMsg(error))
  }
}

async function goChat() {
  const current = activeMatchItem.value
  try {
    await __.$Api.Community.usersmatchSubmitMatch({
      to_uid: String(current.uid || 0)
    })
    stopMatchDetailVoice()
    showMatchPopup.value = false
    matchView.value = 'grid'
    await router.push({
      path: '/chat/room',
      query: {
        uid: String(current.uid || 0),
        name: current.nickname || '匿名用户',
        score: String(Math.round(Number(current.match_percent) || 0))
      }
    })
  } catch (error) {
    console.error('提交匹配结果失败:', error)
    __.$Toast(scircleErrMsg(error))
  }
}
</script>

<style scoped>
.scircle-banner {
  margin-top: 12px;
  position: relative;
}

.scircle-banner-img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 12px;
}

.scircle-matching-text {
  position: absolute;
  left: 50%;
  bottom: 18%;
  transform: translateX(-50%);
  font-family: 'PingFang SC', sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: #2494ff;
}

.scircle-match {
  margin-top: -70px;
  position: relative;
  z-index: 2;
}

.scircle-start {
  width: 100%;
  height: 44px;
  border: 0;
  border-radius: 22px;
  background: linear-gradient(90deg, #ff3b30 0%, #ff9500 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  position: relative;
  z-index: 2;
}

.scircle-start:disabled {
  background: #d0d0d0;
  color: rgba(255, 255, 255, 0.85);
  cursor: not-allowed;
  opacity: 0.85;
}

.scircle-start-icon {
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
}

.scircle-start-text {
  line-height: 44px;
}

.scircle-bottom {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #6c6c6c;
}

.scircle-count {
  margin: 0 4px;
}

.scircle-recharge {
  color: #2494ff;
  text-decoration: none;
  margin-left: 6px;
}

.scircle-right {
  color: #6c6c6c;
  border: 0;
  background: transparent;
  padding: 0;
}

.scircle-help {
  margin-top: 10px;
  text-align: center;
  font-size: 12px;
  color: #a8a8a8;
  width: 100%;
  border: 0;
  background: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.scircle-help-icon {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
}

.scircle-help-popup {
  padding: 16px 12px 20px;
}

.scircle-help-popup-title {
  text-align: center;
  font-family: 'PingFang SC', sans-serif;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 12px;
}

.scircle-help-popup-content {
  max-height: 52vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.scircle-help-faq-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 12px 0;
  border-bottom: 1px solid #efefef;
}

.scircle-help-faq-item:last-child {
  border-bottom: none;
  padding-bottom: 4px;
}

.scircle-help-faq-qt {
  flex: 0 0 auto;
  min-width: 26px;
  max-width: 34px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #2494ff;
  line-height: 1.45;
}

.scircle-help-faq-body {
  flex: 1;
  min-width: 0;
}

.scircle-help-faq-q {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  line-height: 1.45;
  margin-bottom: 8px;
}

.scircle-help-faq-a {
  font-size: 12px;
  color: #6c6c6c;
  line-height: 1.55;
  white-space: pre-line;
  text-align: justify;
  text-align-last: left;
  text-justify: inter-ideograph;
}

.scircle-help-faq-empty {
  text-align: center;
  padding: 28px 12px;
  font-size: 13px;
  color: #999;
}

.scircle-help-popup-btn {
  margin-top: 16px;
  width: 100%;
  height: 44px;
  border-radius: 8px;
  border: 0;
  background: #2494ff;
  color: #fff;
  font-family: 'PingFang SC', sans-serif;
  font-weight: 600;
  font-size: 16px;
}

.scircle-settings {
  padding: 14px 16px 18px;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
}

.scircle-settings-title {
  text-align: center;
  font-family: 'PingFang SC', sans-serif;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 12px;
}

.scircle-settings-body {
  padding-bottom: 0;
  flex: 1;
  min-height: 0;
}

.scircle-settings-scroll {
  flex: 1;
  min-height: 0;
  overflow: auto; 
}

.scircle-settings-section + .scircle-settings-section {
  margin-top: 14px;
}

.scircle-settings-section-title {
  font-size: 13px;
  color: #333333;
  margin: 0 0 10px;
}

.scircle-settings-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 10px;
}

.scircle-settings-tags--small {
  gap: 10px;
}

.scircle-tag {
  border: 0;
  background: #f2f2f2;
  color: #666666;
  border-radius: 6px;
  padding: 0 14px;
  height: 28px;
  line-height: 28px;
  font-size: 12px;
}

.scircle-tag.is-active {
  background: #2494ff;
  color: #ffffff;
}

.scircle-tag--small {
  padding: 0 12px;
  min-width: 44px;
  text-align: center;
}

.scircle-tag-empty {
  font-size: 12px;
  color: #999;
}

.scircle-settings-photo {
  margin-top: 0;
}

.scircle-settings-photo-box {
  width: 156px;
  height: 220px;
  border-radius: 8px;
  border: 1px dashed #d8d8d8;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0;
  cursor: pointer;
}

.scircle-settings-photo-cloud {
  display: block;
  width: 34px;
  height: 34px;
}

.scircle-settings-photo-text {
  font-size: 12px;
  color: #9b9b9b;
  text-align: center;
  line-height: 16px;
}

.scircle-settings-photo-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.scircle-hidden-input {
  display: none;
}

.scircle-settings-voice-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.scircle-settings-voice-title {
  margin-bottom: 0;
  flex: 1;
  min-width: 0;
}

.scircle-settings-voice-delete {
  border: 0;
  background: transparent;
  padding: 0;
  flex-shrink: 0;
  font-size: 14px;
  line-height: 1.3;
  color: #ee0a24;
  cursor: pointer;
}

.scircle-settings-voice-player {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 46px;
  padding: 0 16px;
  border-radius: 8px;
  box-sizing: border-box;
  background: #07c160;
  color: #ffffff;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.scircle-settings-voice-player:active {
  opacity: 0.92;
}

.scircle-settings-voice-player-wave {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: 0.95;
}

.scircle-settings-voice-player-dur {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.scircle-settings-voice-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.scircle-settings-voice-btn {
  border: 0;
  background: #2494ff;
  color: #fff;
  font-size: 12px;
  height: 28px;
  padding: 0 12px;
  border-radius: 6px;
}

.scircle-settings-voice-tip {
  font-size: 12px;
  color: #666;
}

.scircle-settings-footer {
  /* padding-top: 10px; */
}

.scircle-settings-primary {
  margin-top: 0;
  width: 100%;
  height: 44px;
  border-radius: 6px;
  border: 0;
  background: #1db954;
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.scircle-settings-record-icon {
  width: 18px;
  height: 21px;
  display: block;
  flex: 0 0 auto;
}

.scircle-settings-record-text {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 1;
}

.scircle-settings-next {
  margin-top: 12px;
  width: 100%;
  height: 44px;
  border-radius: 6px;
  border: 0;
  background: #2494ff;
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
}

.scircle-settings-next--solo {
  margin-top: 0;
}

.scircle-record-overlay {
  position: fixed;
  inset: 0;
  z-index: 100000;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-end;
  max-width: 100vw;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.45);
}

.scircle-record-dim {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 20px 20px;
  box-sizing: border-box;
}

.scircle-record-actions {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-end;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 340px;
  transition: gap 0.2s ease;
}

.scircle-record-actions.is-cancel-mode {
  justify-content: flex-end;
  padding-right: 8px;
  gap: 14px;
}

.scircle-record-voice {
  width: min(236px, 72vw);
  height: 54px;
  border-radius: 10px;
  background: #2494ff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
  transition:
    width 0.2s ease,
    transform 0.2s ease,
    background 0.2s ease;
}

.scircle-record-voice::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -10px;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #2494ff;
  transition: border-top-color 0.2s ease;
}

.scircle-record-voice.is-cancel {
  width: 120px;
  background: #ff3b30;
  transform: translateX(6px);
}

.scircle-record-voice.is-cancel::after {
  border-top-color: #ff3b30;
}

.scircle-record-bars {
  display: flex;
  align-items: center;
  gap: 6px;
}

.scircle-record-bars .bar {
  width: 6px;
  height: 16px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.9);
  animation: scircleRecordBar 900ms infinite ease-in-out;
}

.scircle-record-bars .bar:nth-child(2) {
  animation-delay: 120ms;
  height: 22px;
}
.scircle-record-bars .bar:nth-child(3) {
  animation-delay: 240ms;
  height: 28px;
}
.scircle-record-bars .bar:nth-child(4) {
  animation-delay: 360ms;
  height: 22px;
}
.scircle-record-bars .bar:nth-child(5) {
  animation-delay: 480ms;
  height: 16px;
}

@keyframes scircleRecordBar {
  0%,
  100% {
    transform: scaleY(0.8);
    opacity: 0.75;
  }
  50% {
    transform: scaleY(1.2);
    opacity: 1;
  }
}

.scircle-record-cancel-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
  min-height: 88px;
  padding-bottom: 2px;
}

.scircle-record-cancel-arc-text {
  width: 120px;
  height: 36px;
  margin-bottom: 2px;
  overflow: visible;
}

.scircle-record-cancel-arc-fill {
  fill: rgba(255, 255, 255, 0.95);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.scircle-record-cancel {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(120, 120, 120, 0.55);
  color: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
  transition:
    width 0.2s ease,
    height 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.scircle-record-cancel.is-active {
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: #2494ff;
  color: #fff;
  box-shadow: 0 4px 14px rgba(36, 148, 255, 0.45);
}

.scircle-record-tip {
  position: relative;
  z-index: 1;
  text-align: center;
  color: rgba(255, 255, 255, 0.92);
  font-size: 15px;
  font-weight: 500;
  margin-top: 22px;
  letter-spacing: 0.04em;
}

.scircle-record-arch {
  flex-shrink: 0;
  width: 100%;
  height: min(168px, 28vh);
  min-height: 120px;
  background: linear-gradient(180deg, #e4e4e6 0%, #d6d6d8 100%);
  border-top-left-radius: 50% 36px;
  border-top-right-radius: 50% 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 8px;
  box-sizing: border-box;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65);
}

.scircle-record-mic-icon {
  color: rgba(0, 0, 0, 0.38);
}

:global(.van-popup.tq-match-popup:not(.van-popup--bottom):not(.van-toast)) {
  width: calc(100vw - 16px) !important;
  max-width: calc(100vw - 16px) !important;
  background: transparent !important;
  box-sizing: border-box !important;
}

.tq-flip {
  width: 100%;
  max-height: 86vh;
  aspect-ratio: 1050 / 2250;
  perspective: 1000px;
}

.tq-flip-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 520ms ease;
}

.tq-flip.is-detail .tq-flip-inner {
  transform: rotateY(180deg);
}

.tq-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 18px;
  overflow: hidden;
}

.tq-face-back {
  transform: rotateY(180deg);
}

.tq-success {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-position: center;
  padding: 78px 15px 18px;
  box-sizing: border-box;
}

.tq-success-title {
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 16px;
}

.tq-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 15px;
}

.tq-grid-item {
  border: 0;
  padding: 0;
  background: transparent;
}

.tq-grid-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 14px;
  display: block;
}

.tq-detail {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-position: center;
  position: relative;
}

.tq-detail::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.28);
}

.tq-detail-top {
  position: relative;
  z-index: 1;
  height: 52px;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
  color: #fff;
}

.tq-detail-back {
  width: 34px;
  height: 34px;
  border: 0;
  background: transparent;
  color: #fff;
  font-size: 26px;
  line-height: 34px;
  text-align: left;
}

.tq-detail-name {
  text-align: center;
  font-size: 14px;
  font-weight: 500;
}

.tq-detail-body {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 90px;
  z-index: 1;
  padding: 0 14px;
  box-sizing: border-box;
}

.tq-detail-match {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 10px;
}

.tq-detail-tags {
  overflow: hidden;
  margin-bottom: 10px;
}

.tq-detail-tags-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 6px;
  -webkit-overflow-scrolling: touch;
}

.tq-pill {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border-radius: 12px;
  background: rgba(36, 148, 255, 0.9);
  color: #fff;
  font-size: 12px;
}

.tq-voice {
  position: relative;
  display: grid;
  grid-template-columns: 36px 1fr 44px;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  border-radius: 10px;
  background: rgba(240, 240, 242, 0.35);
  padding: 0 12px;
  box-sizing: border-box;
  backdrop-filter: blur(6px);
}

.tq-voice-empty {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  padding: 8px 0 4px;
}

.tq-voice-audio {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

.tq-voice-play {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 0;
  background: #ffffff;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  flex-shrink: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.tq-voice-play-icon--play {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 6px 0 6px 9px;
  border-color: transparent transparent transparent #6a6a6a;
  margin-left: 2px;
}

.tq-voice-play-icon--pause {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 12px;
  height: 12px;
}

.tq-voice-play-icon--pause::before,
.tq-voice-play-icon--pause::after {
  content: '';
  width: 3px;
  height: 12px;
  border-radius: 1px;
  background: #6a6a6a;
}

.tq-voice-bars {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  min-height: 22px;
}

.tq-voice-bars .bar {
  width: 3px;
  height: 10px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.92);
  transform-origin: center bottom;
}

.tq-voice-bars.is-playing .bar {
  animation: tqMatchVoiceBar 750ms infinite ease-in-out;
}

.tq-voice-bars.is-playing .bar:nth-child(2) {
  animation-delay: 90ms;
  height: 14px;
}
.tq-voice-bars.is-playing .bar:nth-child(3) {
  animation-delay: 180ms;
  height: 18px;
}
.tq-voice-bars.is-playing .bar:nth-child(4) {
  animation-delay: 270ms;
  height: 14px;
}
.tq-voice-bars.is-playing .bar:nth-child(5) {
  animation-delay: 360ms;
}
.tq-voice-bars.is-playing .bar:nth-child(6) {
  animation-delay: 450ms;
  height: 14px;
}
.tq-voice-bars.is-playing .bar:nth-child(7) {
  animation-delay: 540ms;
  height: 18px;
}
.tq-voice-bars.is-playing .bar:nth-child(8) {
  animation-delay: 630ms;
  height: 14px;
}

@keyframes tqMatchVoiceBar {
  0%,
  100% {
    transform: scaleY(0.75);
    opacity: 0.75;
  }
  50% {
    transform: scaleY(1.35);
    opacity: 1;
  }
}

.tq-voice-dur {
  text-align: right;
  color: rgba(255, 255, 255, 0.95);
  font-size: 13px;
  font-weight: 600;
}

.tq-detail-footer {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 16px;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.tq-btn {
  height: 44px;
  border-radius: 10px;
  border: 0;
  font-weight: 600;
  font-size: 15px;
}

.tq-btn-ghost {
  background: rgba(255, 255, 255, 0.8);
  color: #2d2d2d;
}

.tq-btn-primary {
  background: #2494ff;
  color: #fff;
}

:global(.match-goods-popup-van.van-popup) {
  max-height: 88vh;
}

.match-goods-popup {
  padding: 12px 14px 20px;
  box-sizing: border-box;
  max-height: 82vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.match-goods-popup__header {
  text-align: center;
  padding: 8px 0 14px;
}

.match-goods-popup__prices {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 10px;
}

.match-goods-popup__price-now {
  font-size: 22px;
  font-weight: 600;
  color: #ff7300;
}

.match-goods-popup__price-old {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.match-goods-popup__loading {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.match-goods-popup__empty {
  text-align: center;
  padding: 32px 0;
  font-size: 14px;
  color: #999;
}

.match-goods-popup__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 10px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  padding-bottom: 8px;
}

.match-goods-card {
  position: relative;
  border: 2px solid #eee;
  border-radius: 10px;
  padding: 8px 8px 10px;
  background: #fafafa;
  text-align: center;
  cursor: pointer;
}

.match-goods-card.is-active {
  border-color: #2494ff;
  background: #f0f7ff;
}

.match-goods-card__badge {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 1;
  font-size: 10px;
  color: #fff;
  background: linear-gradient(90deg, #00c6ff, #0072ff);
  padding: 2px 6px;
  border-radius: 4px;
}

.match-goods-card__img {
  display: block;
  width: 100%;
  height: 88px;
  object-fit: contain;
  margin-top: 4px;
}

.match-goods-card__name {
  margin-top: 8px;
  font-size: 12px;
  color: #333;
  line-height: 1.3;
}

.match-goods-popup__buy {
  margin-top: 12px;
  width: 100%;
  height: 46px;
  border: 0;
  border-radius: 10px;
  background: #2494ff;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.match-goods-popup__buy:disabled {
  opacity: 0.5;
}
</style>
