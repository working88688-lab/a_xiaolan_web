<template>
  <div class="scircle-root">
    <scroll-list ref="list">
      <!-- 顶部：两行5列广告组件（样式参考 /home/resource 男色选中态） -->
      <dx-ads
        class="px-1.5"
        :items="props.data?.ads ?? props.data?.rank_list ?? []"
        ad-key="images"
        ad-name="同圈"
        :cols="6"
        :rows="4"
      />

      <!-- 主视觉：tq.png（图内自带头像等元素） -->
      <div class="scircle-banner px-1.5">
        <img class="scircle-banner-img" src="~/assets/image/tq.png" alt="同圈匹配" />
        <div v-if="isMatching" class="scircle-matching-text">快速匹配中…</div>
      </div>

      <!-- 底部按钮区 -->
      <div v-if="!isMatching" class="scircle-match px-1.5">
        <button class="scircle-start" type="button" @click="onStartMatch">
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
              fill="#cccccc"
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
        <div class="scircle-settings-header">
          <div class="scircle-settings-header-left">
            <button
              v-if="settingsStep === 2"
              class="scircle-settings-back"
              type="button"
              aria-label="返回"
              @click="backToSettingsStepOne"
            >
              <svg width="14" height="26" viewBox="0 0 14 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13 25L1 13L13 1"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
          <div class="scircle-settings-title">
            {{ settingsStep === 1 ? '第一步 我的资料' : '第二步-我想匹配' }}
          </div>
          <div class="scircle-settings-header-right" />
        </div>

        <div v-if="settingsStep === 1" class="scircle-settings-body">
          <div class="scircle-settings-scroll">
            <div class="scircle-settings-section">
              <div class="scircle-settings-section-title">
                个人标签（可多选）
                <span class="scircle-required">*</span>
              </div>
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
              <div class="scircle-settings-section-title">
                个人倾向（可多选）
                <span class="scircle-required">*</span>
              </div>
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
              <div class="scircle-settings-section-title">
                个人性癖好（可多选）
                <span class="scircle-required">*</span>
              </div>
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
                  <dx-image
                    v-if="profileImg"
                    :key="profileImg"
                    class="scircle-settings-photo-preview"
                    :src="profileImg"
                    alt="个人照片"
                  />
                  <div v-if="profileImg" class="scircle-settings-photo-mask" aria-hidden="true">
                    <svg
                      class="scircle-settings-photo-mask-icon"
                      width="60"
                      height="60"
                      viewBox="0 0 60 60"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M30 14.7499C26.6275 14.7499 23.4305 15.8464 20.813 17.8264L24.4102 18.7899C24.6648 18.8571 24.9036 18.9739 25.1129 19.1335C25.3222 19.2932 25.4979 19.4927 25.6299 19.7204C25.762 19.9481 25.8478 20.1997 25.8824 20.4607C25.917 20.7216 25.8998 20.9869 25.8316 21.2412C25.7635 21.4954 25.6459 21.7338 25.4854 21.9425C25.325 22.1512 25.125 22.3262 24.8967 22.4574C24.6685 22.5887 24.4166 22.6736 24.1556 22.7072C23.8945 22.7409 23.6293 22.7227 23.3752 22.6536L14.6817 20.3244C14.1694 20.1871 13.7326 19.8518 13.4675 19.3925C13.2023 18.9331 13.1305 18.3872 13.2677 17.8749L15.597 9.1819C15.6642 8.92736 15.781 8.6886 15.9407 8.47929C16.1003 8.26999 16.2998 8.09428 16.5275 7.96222C16.7552 7.83016 17.0068 7.74437 17.2678 7.70975C17.5287 7.67513 17.794 7.69238 18.0483 7.7605C18.3025 7.82861 18.5409 7.94626 18.7496 8.1067C18.9583 8.26713 19.1333 8.46719 19.2645 8.69541C19.3958 8.92362 19.4807 9.1755 19.5143 9.43659C19.548 9.69768 19.5298 9.96285 19.4608 10.2169L18.454 13.9744C21.7763 11.5761 25.7873 10.2499 30 10.2499C40.9075 10.2499 49.75 19.0924 49.75 29.9999C49.75 40.9074 40.9075 49.7499 30 49.7499C19.0925 49.7499 10.25 40.9074 10.25 29.9999C10.25 29.4032 10.4871 28.8309 10.909 28.4089C11.331 27.9869 11.9033 27.7499 12.5 27.7499C13.0967 27.7499 13.669 27.9869 14.091 28.4089C14.5129 28.8309 14.75 29.4032 14.75 29.9999C14.75 38.4224 21.5775 45.2499 30 45.2499C38.4225 45.2499 45.25 38.4224 45.25 29.9999C45.25 21.5774 38.4225 14.7499 30 14.7499Z"
                        fill="white"
                        fill-opacity="0.8"
                      />
                    </svg>
                    <div class="scircle-settings-photo-mask-text">
                      重新上传
                      <br />
                      不大于2M
                    </div>
                  </div>
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
                  <div v-if="!profileImg" class="scircle-settings-photo-text">
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

            <!-- 语音功能：先整体注释（包含上传/播放/录音）
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
            -->
          </div>

          <div class="scircle-settings-footer">
            <!-- 语音功能：录音入口先注释
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
            -->
            <button
              class="scircle-settings-next"
              type="button"
              :disabled="isSavingStep1"
              :class="{ 'scircle-settings-next--solo': false }"
              @click="onStepOneNext"
            >
              {{ isSavingStep1 ? '提交中...' : '下一步' }}
            </button>
          </div>
        </div>

        <div v-else class="scircle-settings-body">
          <div class="scircle-settings-scroll">
            <div class="scircle-settings-section">
              <div class="scircle-settings-section-title">
                他的标签（可多选）
                <span class="scircle-required">*</span>
              </div>
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
              </div>
            </div>

            <div class="scircle-settings-section">
              <div class="scircle-settings-section-title">
                他的倾向（可多选）
                <span class="scircle-required">*</span>
              </div>
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
              </div>
            </div>

            <div class="scircle-settings-section">
              <div class="scircle-settings-section-title">
                他的性癖好（可多选）
                <span class="scircle-required">*</span>
              </div>
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

    <!-- 语音功能：录音遮罩层先注释
    <Teleport to="body">
      <div v-if="showRecordOverlay" class="scircle-record-overlay">
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
              <svg v-if="isRecordCancel" class="scircle-record-cancel-arc-text" viewBox="0 0 120 36" aria-hidden="true">
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
            <path d="M28 36c4.42 0 8-3.58 8-8V18c0-4.42-3.58-8-8-8s-8 3.58-8 8v10c0 4.42 3.58 8 8 8z" stroke="currentColor" stroke-width="2.2" />
            <path d="M18 26v2c0 5.52 4.48 10 10 10s10-4.48 10-10v-2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
            <path d="M28 40v6M22 46h12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
            <path d="M38 22c0-5.52-4.48-10-10-10M18 22c0-5.52 4.48-10 10-10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.45" />
          </svg>
        </div>
      </div>
    </Teleport>
    -->

    <van-popup
      v-model:show="showMatchPopup"
      teleport="body"
      :close-on-click-overlay="false"
      :closeable="false"
      :show-toolbar="false"
      :lock-scroll="true"
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
                  <img
                    :key="item.cover"
                    v-lazyLoad="item.cover"
                    class="tq-grid-img"
                    src="~/assets/image/img_loading.png"
                    alt="匹配结果"
                  />
                </button>
              </div>
            </div>
          </div>

          <!-- 第二层：大图详情 -->
          <div class="tq-face tq-face-back">
            <div class="tq-detail">
              <img
                v-if="activeDetailBg"
                :key="activeDetailBg"
                v-lazyLoad="activeDetailBg"
                class="tq-detail-bg"
                src="~/assets/image/img_loading.png"
                alt=""
              />
              <div class="tq-detail-top">
                <div class="tq-detail-top-left">
                  <button class="tq-detail-back" type="button" aria-label="返回" @click="backToMatchGrid">
                    <svg width="14" height="26" viewBox="0 0 14 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M13 25L1 13L13 1"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>

                  <!-- 语音功能：详情页播放按钮先注释
                  <button
                    v-if="activeMatchItem.voice_url"
                    class="tq-detail-sound"
                    type="button"
                    aria-label="播放语音"
                    @click="toggleMatchVoicePlay"
                  >
                    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_137_5162)">
                        <path
                          d="M0.000773703 24.1082C0.00615994 24.3223 0.0716979 24.5306 0.189892 24.7092C0.308086 24.8878 0.474164 25.0296 0.669132 25.1182L10.776 29.7061C10.9499 29.7851 11.1409 29.8192 11.3314 29.8053C11.5219 29.7914 11.7059 29.7298 11.8664 29.6263C12.027 29.5228 12.159 29.3806 12.2503 29.2129C12.3416 29.0451 12.3894 28.8571 12.3892 28.6661L12.3729 3.93451C12.3727 3.72337 12.314 3.51641 12.2032 3.33667C12.0924 3.15693 11.9339 3.01146 11.7453 2.91644C11.5568 2.82142 11.3456 2.78057 11.1352 2.79845C10.9248 2.81634 10.7235 2.89224 10.5537 3.01772L1.45877 9.73815C1.32673 9.83575 1.2173 9.9607 1.13797 10.1045C1.05863 10.2482 1.01125 10.4074 0.999073 10.5712L0.00338193 23.9944C0.000847602 24.0324 -2.26413e-05 24.0701 0.000773703 24.1082ZM2.3384 23.3694L3.23628 11.2623L10.0917 6.19585L10.1057 26.8957L2.3384 23.3694ZM15.4865 32.6029H17.1166V29.3426H15.4865V32.6029ZM15.4865 27.7124H17.1166V24.4522H15.4865V27.7124ZM15.4865 22.822H17.1166V19.5617H15.4865V22.822ZM15.4865 17.9316H17.1166V14.6713H15.4865V17.9316ZM15.4865 13.0411H17.1166V9.78086H15.4865V13.0411ZM15.4865 8.15072H17.1166V4.89043H15.4865V8.15072ZM15.4865 3.26029H17.1166V0H15.4865V3.26029ZM20.2139 28.6664C20.2137 28.8574 20.2615 29.0453 20.3528 29.2131C20.4441 29.3808 20.5761 29.5229 20.7366 29.6264C20.8971 29.7299 21.081 29.7915 21.2715 29.8055C21.4619 29.8194 21.6529 29.7854 21.8268 29.7064L31.9337 25.1182C32.1287 25.0296 32.2948 24.8879 32.4131 24.7093C32.5313 24.5306 32.5969 24.3223 32.6023 24.1082C32.6031 24.0701 32.6023 24.0321 32.5997 23.9941L31.604 10.5712C31.5919 10.4074 31.5445 10.2482 31.4651 10.1045C31.3858 9.9607 31.2764 9.83575 31.1443 9.73815L22.0494 3.01772C21.8796 2.89224 21.6783 2.81634 21.4679 2.79845C21.2576 2.78057 21.0463 2.82142 20.8578 2.91644C20.6692 3.01146 20.5107 3.15693 20.3999 3.33667C20.2891 3.51641 20.2304 3.72337 20.2302 3.93451L20.2139 28.6664Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_137_5162">
                          <rect width="32.6029" height="32.6029" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                  -->
                </div>

                <div class="tq-detail-name">{{ activeMatchItem.nickname || '匿名用户' }}</div>
                <div class="tq-detail-right" />
              </div>

              <div class="tq-detail-body">
                <div class="tq-detail-match">{{ activeMatchLineText }}</div>

                <div class="tq-detail-tags">
                  <div class="tq-detail-tags-scroll">
                    <span v-for="(tag, i) in activeMatchItem.tags" :key="`${tag}-${i}`" class="tq-pill">
                      #{{ tag }}
                    </span>
                  </div>
                </div>

                <!-- 语音功能：详情页语音模块先注释
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
                -->
              </div>

              <div class="tq-detail-footer">
                <button class="tq-btn tq-btn-ghost" type="button" @click="closeMatchPopup">返回匹配</button>
                <!-- 后续进入聊天：先注释 -->
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
import { computed, onBeforeUnmount, onMounted } from 'vue'
import successBgUrl from '~/assets/image/success-bg.png'
import tqItemUrl from '~/assets/image/tq-item.png'

const props = defineProps<{
  data: any
}>()
const listRef = useTemplateRef('list')
const { scrollTop } = useScrollTop(listRef)
const __ = useNuxtApp()
const router = useRouter()
const userStore = useUserStore()

// 统一处理「根相对路径」资源地址拼接
const globalStore = useGlobalStore()
const appConfig = useAppConfig()
function getMediaOrigin(): string {
  const thumb = globalStore.config?.activity_thumb || globalStore.config?.index_ads_thumb
  if (thumb) {
    try {
      return new URL(thumb).origin
    } catch {
      /* ignore */
    }
  }
  const base = appConfig.api?.baseURL as string | undefined
  if (base) {
    try {
      return new URL(base).origin
    } catch {
      /* ignore */
    }
  }
  // 最后兜底：至少保证根相对路径能在当前站点域名下命中
  if (import.meta.client) return window.location.origin || ''
  return ''
}

function resolveMediaUrl(path: string | undefined): string {
  if (!path?.trim()) return ''
  const p = path.trim()
  if (/^https?:\/\//i.test(p) || p.startsWith('data:') || p.startsWith('blob:')) return p
  if (p.startsWith('//')) {
    if (import.meta.client) return window.location.protocol + p
    return 'https:' + p
  }
  const origin = getMediaOrigin()
  if (!origin) return p
  if (p.startsWith('/')) return origin + p
  return `${origin}/${p}`
}

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

function shouldOpenProfileSettingsFromErr(err: unknown): boolean {
  const msg = scircleErrMsg(err)
  return msg.includes('匹配资料')
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

    // readme 为空时再补一次 talk/config，但不要覆盖 myprofile 的 match_num（可用匹配次数以 myprofile 为准）
    if (!talkHomeData.value.readme.length) {
      const res = await __.$Api.Community.talkConf().catch(e => {
        if (scircleDebug) console.warn('[scircle] POST /api/talk/config 失败', e)
        __.$Toast(scircleErrMsg(e))
        return null
      })
      if (scircleDebug && res) {
        console.log(
          '%c[scircle] ③ POST /api/talk/config（readme 空且 match_num 为 0 时补充拉取）',
          'font-weight:bold;color:#07c160',
          res
        )
        console.log('[scircle] ③ data：', res?.data)
      }
      if (res?.data) {
        const cur = talkHomeData.value
        const next = res.data as TalkHomeData
        // 各用各的：readme/online_count 用 talk/config；次数等 info 字段用 myprofile
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
    // 扣费后同步 Pinia 金币余额，否则返回「我的」等页仍显示旧 coins（iOS 上尤为明显）
    try {
      await userStore.info()
    } catch {
      /* 忽略 info 失败，避免掩盖购买成功提示 */
    }
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
const showMatchPopup = ref(false)
const matchView = ref<'grid' | 'detail'>('grid')
const selectedMatchIndex = ref(0)
const myProfileGroups = ref<Record<number, MatchTagItem[]>>({ 1: [], 2: [], 3: [] })
const expectProfileGroups = ref<Record<number, MatchTagItem[]>>({ 1: [], 2: [], 3: [] })
const myProfileSelected = ref<string[]>([])
const expectProfileSelected = ref<string[]>([])
const profileImg = ref('')
const profileImageInputRef = ref<HTMLInputElement | null>(null)
const profileImgObjectUrl = ref<string | null>(null)
const isSavingStep1 = ref(false)
const isSavingStep2 = ref(false)
const isUploadingImage = ref(false)

const myProfileTags1 = computed(() => myProfileGroups.value[1] || [])
const myProfileTags2 = computed(() => myProfileGroups.value[2] || [])
const myProfileTags3 = computed(() => myProfileGroups.value[3] || [])
const expectProfileTags1 = computed(() => expectProfileGroups.value[1] || [])
const expectProfileTags2 = computed(() => expectProfileGroups.value[2] || [])
const expectProfileTags3 = computed(() => expectProfileGroups.value[3] || [])

// 开发预览 mock（已停用）：之前用于直接用 get_match_info 数据展示第二层
// onMounted(() => {
//   if (!(import.meta.env.DEV && import.meta.client)) return
//
//   const mockDetail = {
//     uid: '38238161',
//     score: '匹配度0%, 你俩超级搭哟!',
//     thumb: 'https://new.cimefl.cn/new/xiao/20201117/2020111718104250323.png',
//     voice: 'https://upload.ycomesc.live/20260328/4785cbf0d920222f8f462385f03d64c0.mp4',
//     voice_url: 'https://upload.ycomesc.live/20260328/4785cbf0d920222f8f462385f03d64c0.mp4',
//     voice_duration: 0,
//     nickname: '超级黄蜂',
//     tags_list: [
//       { id: 3, name: '猛男' },
//       { id: 6, name: '0' },
//       { id: 7, name: '0.5' },
//       { id: 10, name: '恋同' },
//       { id: 11, name: '恋物' }
//     ]
//   }
//
//   const mockItem: MatchItem = {
//     uid: mockDetail.uid,
//     nickname: mockDetail.nickname,
//     avatar: '',
//     cover: mockDetail.thumb,
//     match_percent: 0,
//     match_line_text: String(mockDetail.score || '').trim(),
//     tags: Array.isArray(mockDetail.tags_list)
//       ? mockDetail.tags_list.map((t: any) => String(t?.name ?? '')).filter(Boolean)
//       : [],
//     voice_url: voiceUrlFromApiItem(mockDetail),
//     voice_duration: voiceDurationLabelFromApi(mockDetail)
//   }
//
//   matchItems.value = Array.from({ length: 6 }).map((_, idx) =>
//     idx === 0
//       ? mockItem
//       : {
//           uid: idx,
//           nickname: '匿名用户',
//           avatar: '',
//           cover: tqItemUrl,
//           match_percent: 0,
//           match_line_text: '',
//           tags: [],
//           voice_url: '',
//           voice_duration: '0"'
//         }
//   )
//   selectedMatchIndex.value = 0
//   showMatchPopup.value = true
//   matchView.value = 'detail'
// })

// 语音功能：相关工具方法/录音逻辑先注释（包含时长探测、mime 选择、上传等）

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
    selected: [...(data?.['1'] || []), ...(data?.['2'] || []), ...(data?.['3'] || [])]
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

function selectedCountInGroup(selected: string[], group: MatchTagItem[]) {
  if (!Array.isArray(group) || !group.length) return 0
  if (!Array.isArray(selected) || !selected.length) return 0
  const set = new Set(selected.map(normalizeTagId))
  let cnt = 0
  for (const item of group) {
    if (set.has(normalizeTagId(item?.id))) cnt += 1
  }
  return cnt
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
  // 语音功能：先注释
  // profileVoice.value = myParsed.voice
}

function onPickProfileImage() {
  if (isUploadingImage.value) return
  profileImageInputRef.value?.click()
}

function onDeleteProfileImage() {
  if (isUploadingImage.value) return
  profileImg.value = ''
  if (profileImgObjectUrl.value) {
    try {
      URL.revokeObjectURL(profileImgObjectUrl.value)
    } catch {
      /* ignore */
    }
    profileImgObjectUrl.value = null
  }
  const input = profileImageInputRef.value
  if (input) input.value = ''
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

    // 选完立刻反显（与 van-uploader 类似体验）；上传完成后用服务端 url 替换
    if (profileImgObjectUrl.value) {
      try {
        URL.revokeObjectURL(profileImgObjectUrl.value)
      } catch {
        /* ignore */
      }
      profileImgObjectUrl.value = null
    }
    try {
      const objectUrl = URL.createObjectURL(file)
      profileImgObjectUrl.value = objectUrl
      profileImg.value = objectUrl
    } catch {
      /* ignore：不影响后续上传 */
    }

    const compressed = await __.$ImageCompression.compressor(file)
    const uploadRes = await __.$Api.uploadImage({ file: compressed, useCompress: false })
    // 兼容：既可能是拦截后返回的字符串，也可能是原始 { code, msg } 对象
    let raw = ''
    if (typeof uploadRes === 'string') {
      raw = uploadRes
    } else if (uploadRes && typeof uploadRes === 'object') {
      const code = (uploadRes as any).code
      raw = String((uploadRes as any).msg ?? (uploadRes as any).data ?? (uploadRes as any).url ?? '')
      if (code != null && Number(code) !== 1) {
        throw new Error(String((uploadRes as any).msg ?? '图片上传失败'))
      }
    } else {
      raw = String(uploadRes ?? '')
    }

    profileImg.value = resolveMediaUrl(raw)
    if (profileImgObjectUrl.value) {
      try {
        URL.revokeObjectURL(profileImgObjectUrl.value)
      } catch {
        /* ignore */
      }
      profileImgObjectUrl.value = null
    }
    __.$Toast('图片上传成功')
  } catch (error) {
    console.error('图片上传失败:', error)
    __.$Toast(scircleErrMsg(error))
  } finally {
    isUploadingImage.value = false
    if (input) input.value = ''
  }
}

onBeforeUnmount(() => {
  if (profileImgObjectUrl.value) {
    try {
      URL.revokeObjectURL(profileImgObjectUrl.value)
    } catch {
      /* ignore */
    }
    profileImgObjectUrl.value = null
  }
})

// 语音功能：上传/删除/播放个人语音先注释

const matchItems = ref<MatchItem[]>([])
// 语音功能：匹配详情语音播放先注释

const activeMatchItem = computed<MatchItem>(() => {
  return (
    matchItems.value[selectedMatchIndex.value] || {
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
  )
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
    // 语音功能：先注释
    voice_url: '',
    voice_duration: '0"'
  }))
}

// 语音功能：匹配详情语音播放相关方法先注释

function onHelp() {
  showHelp.value = true
}

async function onStartMatch() {
  if (matchRemainNum.value <= 0) {
    __.$Toast('匹配次数不足')
    return
  }
  isMatching.value = true
  try {
    let res: any = null
    let apiName = ''
    try {
      res = await __.$Api.Community.usersmatchMatch({})
      apiName = 'usersmatchMatch'
    } catch (e) {
      if (shouldOpenProfileSettingsFromErr(e)) {
        await openSettings()
        return
      }
      __.$Toast(scircleErrMsg(e))
    }
    if (!res) {
      res = await __.$Api.Community.talkMatch({})
      apiName = 'talkMatch'
    }
    const rows = normalizeMatchItems(res?.data)
    if (scircleDebug) {
      const styleTitle =
        'background:#111827;color:#fff;padding:4px 8px;border-radius:6px;font-weight:800;font-size:12px'
      const styleWarn = 'background:#b91c1c;color:#fff;padding:2px 6px;border-radius:6px;font-weight:800'
      const raw = res?.data
      const rawCount = Array.isArray(raw) ? raw.length : Array.isArray(raw?.list) ? raw.list.length : undefined
      console.groupCollapsed(
        `%c[iOS][同圈] 匹配接口返回（${apiName || 'unknown'}）%c rawCount=${rawCount ?? 'unknown'} normalizeCount=${rows.length}`,
        styleTitle,
        rawCount == null && rows.length === 0 ? styleWarn : 'color:#16a34a;font-weight:800'
      )
      console.log('%c[scircle][match] 接口整包 res =', 'font-weight:800;color:#111827', res)
      console.log('%c[scircle][match] res.data =', 'font-weight:800;color:#111827', raw)
      console.log('%c[scircle][match] res.data(推测原始条数) =', 'font-weight:800;color:#111827', rawCount)
      console.log(
        '%c[scircle][match] normalizeMatchItems(res.data) 长度 =',
        'font-weight:800;color:#111827',
        rows.length
      )
      console.table(
        rows.map((it, i) => ({
          i,
          uid: it.uid,
          nickname: it.nickname,
          cover: it.cover,
          match_percent: it.match_percent,
          tags_len: Array.isArray(it.tags) ? it.tags.length : 0
        }))
      )
      console.groupEnd()
    }
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

    // 匹配成功后：本地先扣一次（立即反馈），再异步刷新接口数据做校准
    if (myProfileMatchNum.value > 0) {
      myProfileMatchNum.value = Math.max(0, Number(myProfileMatchNum.value) - 1)
    }
    void fetchTalkHome()
  } catch (error) {
    console.error('匹配失败:', error)
    if (shouldOpenProfileSettingsFromErr(error)) {
      await openSettings()
      return
    }
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

defineExpose({
  openSettings
})

function resetSettings() {
  settingsStep.value = 1
}

function backToSettingsStepOne() {
  if (settingsStep.value !== 2) return
  settingsStep.value = 1
}

async function onStepOneNext() {
  if (isSavingStep1.value) return
  const tagIds = myProfileSelected.value.join(',')
  const img = profileImg.value?.trim()
  // 语音功能：先注释
  // const voice = profileVoice.value?.trim()

  // 3 类都必须至少选 1 个
  if (selectedCountInGroup(myProfileSelected.value, myProfileTags1.value) <= 0) {
    __.$Toast('请至少选择一个个人标签')
    return
  }
  if (selectedCountInGroup(myProfileSelected.value, myProfileTags2.value) <= 0) {
    __.$Toast('请至少选择一个个人倾向')
    return
  }
  if (selectedCountInGroup(myProfileSelected.value, myProfileTags3.value) <= 0) {
    __.$Toast('请至少选择一个个人性癖好')
    return
  }

  isSavingStep1.value = true
  try {
    const payload: Record<string, any> = {}
    if (tagIds) payload.tag_ids = tagIds
    if (img) payload.img = img
    // 语音功能：先注释
    // if (voice) payload.voice = voice

    await __.$Api.Community.usersmatchUpdateProfile(payload)
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
  const tagIds = expectProfileSelected.value.join(',')
  // 3 类都必须至少选 1 个
  if (selectedCountInGroup(expectProfileSelected.value, expectProfileTags1.value) <= 0) {
    __.$Toast('请至少选择一个他的标签')
    return
  }
  if (selectedCountInGroup(expectProfileSelected.value, expectProfileTags2.value) <= 0) {
    __.$Toast('请至少选择一个他的倾向')
    return
  }
  if (selectedCountInGroup(expectProfileSelected.value, expectProfileTags3.value) <= 0) {
    __.$Toast('请至少选择一个他的性癖好')
    return
  }
  isSavingStep2.value = true
  try {
    await __.$Api.Community.usersmatchUpdateExpectProfile({
      tag_ids: tagIds
    })
    showSettings.value = false
  } catch (error) {
    console.error('更新匹配偏好失败:', error)
    __.$Toast(scircleErrMsg(error))
  } finally {
    isSavingStep2.value = false
  }
}

// 语音功能：录音相关逻辑先注释（含遮罩层、取消区域判断、MediaRecorder 等）

function openMatchDetail(idx: number) {
  selectedMatchIndex.value = idx
  matchView.value = 'detail'
  void fetchMatchDetail()
}

function backToMatchGrid() {
  matchView.value = 'grid'
}

function closeMatchPopup() {
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
    const matchLineText = typeof scoreRaw === 'string' && scoreRaw.trim() !== '' ? scoreRaw.trim() : ''
    // 语音功能：先注释（详情接口的语音字段解析）
    const nextItem: MatchItem = {
      ...current,
      uid: detail?.uid ?? current.uid,
      nickname: detail?.nickname ?? current.nickname,
      avatar: detail?.avatar_url ?? detail?.avatar ?? detail?.thumb ?? current.avatar,
      cover: detail?.thumb ?? detail?.avatar_url ?? detail?.avatar ?? current.cover,
      match_percent: current.match_percent,
      match_line_text: matchLineText,
      tags: list.map((it: any) => it?.name).filter(Boolean),
      // 语音功能：先注释
      voice_url: '',
      voice_duration: '0"'
    }
    matchItems.value[selectedMatchIndex.value] = nextItem
  } catch (error) {
    console.error('获取匹配详情失败:', error)
    __.$Toast(scircleErrMsg(error))
  }
}

async function goChat() {
  const current = activeMatchItem.value
  // 首次在匹配成功页选择「聊天」时提示；确认后写入本地，下次匹配不再弹（需求 16434）
  const CONFIRM_KEY = 'scircle_match_first_chat_confirmed'
  if (import.meta.client && window.localStorage.getItem(CONFIRM_KEY) !== '1') {
    try {
      // 全屏匹配弹层 z-index 很高，Dialog 默认层级在 iOS 上会被挡住，需抬高并挂到 body
      await __.$Confirm({
        title: '提示',
        message: '是否选择此人进行聊天，选择后其他人将消失在人海。',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        teleport: 'body',
        zIndex: 300000
      })
      window.localStorage.setItem(CONFIRM_KEY, '1')
    } catch {
      // 取消：不记已提示，下次仍可弹
      return
    }
  }
  try {
    await __.$Api.Community.usersmatchSubmitMatch({
      to_uid: String(current.uid || 0)
    })
    // stopMatchDetailVoice()
    showMatchPopup.value = false
    matchView.value = 'grid'
    const score = Math.round(Number(current.match_percent) || 0)
    await router.push({
      path: '/chat/room',
      query: {
        uid: String(current.uid || 0),
        name: current.nickname || '匿名用户',
        // get_match_info 需要列表分数；同时兼容历史参数名 scoreNum
        score: String(score),
        scoreNum: String(score),
        // chat-room 头像兜底：优先用详情/列表 thumb（这里用当前项 cover）
        thumb: String(current.cover || '')
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

.scircle-settings-header {
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  margin-bottom: 12px;
}

.scircle-settings-header-left,
.scircle-settings-header-right {
  height: 44px;
  display: flex;
  align-items: center;
}

.scircle-settings-header-right {
  justify-content: flex-end;
}

.scircle-settings-back {
  width: 34px;
  height: 34px;
  border: 0;
  background: transparent;
  color: #333;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.scircle-settings-back svg {
  width: 14px;
  height: 14px;
  display: block;
}

.scircle-settings-title {
  text-align: center;
  font-family: 'PingFang SC', sans-serif;
  font-weight: 600;
  font-size: 16px;
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
  position: relative;
  z-index: 2;
}

.scircle-required {
  color: #ee0a24;
  margin-left: 4px;
  font-weight: 600;
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
  position: relative;
  overflow: hidden;
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
  display: block;
  z-index: 1;
}

.scircle-settings-photo-mask {
  position: absolute;
  inset: 0;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.92);
  pointer-events: none;
  z-index: 2;
}

.scircle-settings-photo-mask-icon {
  width: 30px;
  height: 30px;
  display: block;
}

.scircle-settings-photo-mask-text {
  font-size: 12px;
  line-height: 16px;
  text-align: center;
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
  padding-top: 0;
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
  width: calc(100vw - 20px) !important;
  max-width: calc(100vw - 20px) !important;
  background: transparent !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: auto;
}

.tq-flip {
  width: 100%;
  /* iOS 二次打开时 vh/max-height + aspect-ratio 容易抖动导致裁切，直接固定视口高度更稳 */
  height: 92vh;
  height: 92svh;
  max-height: none;
  aspect-ratio: auto;
  perspective: 1000px;
  overflow: hidden;
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
  display: flex;
  flex-direction: column;
  min-height: 0;
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
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 4px;
  align-content: start;
}

.tq-grid-item {
  border: 0;
  padding: 0;
  background: transparent;
}

.tq-grid-img {
  width: 100%;
  /* iOS 上 aspect-ratio/auto 高度易造成行高被拉大，固定一个随屏宽变化的高度更稳 */
  height: min(42vw, 176px);
  object-fit: cover;
  border-radius: 14px;
  display: block;
}

.tq-detail {
  width: 100%;
  height: 100%;
  position: relative;
}

.tq-detail-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  grid-template-columns: 84px 1fr 44px;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.45);
}

.tq-detail-top-left {
  display: flex;
  align-items: center;
  gap: 10px;
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
.tq-detail-back svg {
  width: 14px;
  height: 14px;
}

.tq-detail-sound {
  width: 34px;
  height: 34px;
  border: 0;
  background: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.tq-detail-sound svg {
  width: 16px;
  height: 16px;
  display: block;
}

.tq-detail-name {
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.tq-detail-body {
  position: absolute;
  left: 0;
  right: 0;
  /* safe-area 兜底：部分 WebView 不支持 env(...) 时需要保留基础 bottom 值 */
  bottom: 90px;
  bottom: calc(90px + env(safe-area-inset-bottom));
  z-index: 3;
  padding: 10px 14px;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.45);
}

.tq-detail-match {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 10px;
}

.tq-detail-tags {
  overflow: hidden;
  /* margin-bottom: 10px; */
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
  /* safe-area 兜底：部分 WebView 不支持 env(...) 时需要保留基础 bottom 值 */
  bottom: 20px;
  /* bottom: calc(44px + env(safe-area-inset-bottom)); */
  z-index: 6;
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
