/* eslint-disable */
// @ts-nocheck
/**
 * desc: 指令函数配置
 * date: 2024.04.24
 */

import loading from '@/assets/image/img_loading.png'
import { showImagePreview } from 'vant'

// 向 Worker 发送消息
export default defineNuxtPlugin(nuxtApp => {
  if (typeof window.requestIdleCallback !== 'function') {
    window.requestIdleCallback = function (cb, { timeout } = {}) {
      const start = Date.now();
      return setTimeout(() => {
        const now = Date.now();
        cb({
          didTimeout: !!timeout && now - start >= timeout,
          timeRemaining: function () {
            return Math.max(0, 50 - (Date.now() - now));
          },
        });
      }, 1);
    };

    window.cancelIdleCallback = function (id) {
      clearTimeout(id);
    };
  }

  const { vueApp, $GlobalObject, $Worker } = nuxtApp;

  const errorHandler = el => {
    el.setAttribute('src', loading)
    el.onload = () => {
      el.classList.remove('loading')
      el.classList.add('is-error')
    }
  }
  // 处理预览
  const previewHandler = (el, _img, preview, group) => {
    // 图片浏览
    preview &&
      el.addEventListener('click', function (e) {
        const images = group ? $GlobalObject._IMAGE_PREVIE_GROUPS.get(group) : [_img]
        const startPosition = group ? images.indexOf(_img) : 0
        showImagePreview({
          images,
          closeable: true,
          showIndex: !!group,
          loop: false,
          startPosition
        })
      })
  }
  const decrypted_handler = (el: HTMLImageElement) => {
    el.classList.remove('loading')
    el.dispatchEvent(
      new CustomEvent('decrypted', {
        bubbles: false, // 事件是否应该冒泡
        cancelable: true, // 事件是否可以被取消
      }),
    )
  }
  const groupHandler = (el, _img, group) => {
    if (group) {
      const index = Number(el.dataset.index)
      const cacheGroup = $GlobalObject._IMAGE_PREVIE_GROUPS.get(group)
      if (!cacheGroup) {
        const groups = []
        groups[index] = _img
        $GlobalObject._IMAGE_PREVIE_GROUPS.set(group, groups)
      } else {
        cacheGroup[index] = _img
      }
    }
  }

  const cacheHandler = (el, _url, preview, group) => {
    el.setAttribute('src', _url)
    el.onload = () => {
      decrypted_handler(el)
    }
    // 分组预览
    groupHandler(el, _url, group)
    // 图片浏览
    previewHandler(el, _url, preview, group)
  }

  const fetch_resouce_from_worker = (src: string, { type = 'image', responseType }) => {
    return new Promise((resolve, reject) => {
      $GlobalObject._IMAGE_DECRY_SCHEDULER[src] = {}
      $GlobalObject._IMAGE_DECRY_SCHEDULER[src].resolve = resolve
      $GlobalObject._IMAGE_DECRY_SCHEDULER[src].reject = reject
      $Worker.postMessage({
        type,
        data: src,
        key: src,
        responseType
      })
    })
  }

  const lazyLoad = (el, binding, vnode) => {
    if (!binding.value) return false

    // 初始参数
    const imglink = binding.value
    const preview = el.getAttribute('data-image-preview') ? true : false
    const noloads = el.getAttribute('data-no-loading') ? true : false
    const imgtype = imglink.split('.').pop()
    // 初始加载
    if (!noloads) {
      el.setAttribute('src', loading)
      el.classList.add('loading')
    }

    // 添加分组
    const group = binding.arg

    // 缓存取图
    const CACHE_IMG = $GlobalObject['_CACHE_IMAGES_MAPS']?.[imglink]

    if (CACHE_IMG) {
      // status 为1  说明已经解密完成
      const { status } = CACHE_IMG
      if (status === 1) {
        cacheHandler(el, CACHE_IMG.url, preview, group)
        return false
      } else if (status === 2) {
        // 加载失败
        !noloads && errorHandler(el)
        return false
      } else {
        CACHE_IMG.pending.push(url => {
          cacheHandler(el, url, preview, group)
        })
      }
    } else {
      $GlobalObject['_CACHE_IMAGES_MAPS'][imglink] = {
        pending: []
      }
    }

    // 交叉巡查
    new IntersectionObserver((e, o) => {
      if (e.pop().isIntersecting) {
        const CACHE = $GlobalObject['_CACHE_IMAGES_MAPS']?.[imglink]
        if (CACHE && CACHE.status >= 0) {
          const { status } = CACHE
          if (status === 1) {
            cacheHandler(el, CACHE.url, preview, group)
            el && o.unobserve(el)
            o.disconnect()
            o = null
            return false
          } else if (status === 0) {
            CACHE.pending.push(url => {
              cacheHandler(el, url, preview, group)
            })
            return false
          } else {
            el && o.unobserve(el)
            o.disconnect()
            o = null
            !noloads && errorHandler(el)
            return false
          }
        }
        $GlobalObject['_CACHE_IMAGES_MAPS'][imglink].status = 0



        fetch_resouce_from_worker(imglink, { responseType: 'url' })
          // 4. 监听事件
          .then(localImage => {

            // 分组预览
            groupHandler(el, localImage, group)
            // 图片浏览
            previewHandler(el, localImage, preview, group)

            // 异常处理
            el.addEventListener('error', function () {
              !noloads && errorHandler(el)
            })

            // 添加缓存
            $GlobalObject['_CACHE_IMAGES_MAPS'][imglink] = {
              ...$GlobalObject['_CACHE_IMAGES_MAPS'][imglink],
              status: 1,
              url: localImage
            }

            $GlobalObject['_CACHE_IMAGES_MAPS'][imglink].pending.forEach(callback => {
              callback(localImage)
            })

            el.setAttribute('src', localImage)
            el.onload = () => decrypted_handler(el)


            Reflect.deleteProperty($GlobalObject['_CACHE_IMAGES_MAPS'][imglink], 'pending')
          })

          // 5. 异常处理
          .catch(err => {

            !noloads && errorHandler(el)
            $GlobalObject['_CACHE_IMAGES_MAPS'][imglink].status = 2 //加载失败

            console.error(`图片获取失败:${imglink}`, err)
          })
          .finally(() => {
            // 停止触发
            el && o.unobserve(el)
            o.disconnect()
            o = null
          })
      }
    }).observe(el)
  }

  /**
   * 图片加载(赖加载)
   */
  vueApp.directive('lazyLoad', {
    beforeMount(el, binding, vnode) {
      lazyLoad(el, binding, vnode)
    },
    beforeUnmount(el, binding, vnode) {
      const group = binding.arg
      if (group) {
        $GlobalObject._IMAGE_PREVIE_GROUPS.delete(group)
      }
    }
  })

  /**
   * 页面跳转
   */
  const LINK_BIND_HANDLER = Symbol('link__bind__handler')
  const linkBind = (el, binding, vnode) => {
    const _this = nuxtApp

    if (!binding.value) {
      return
    }
    const handler = () => {
      _this.$NavigateTo(binding.value)
    }
    el[LINK_BIND_HANDLER] = handler
    el.addEventListener('click', handler)
  }

  vueApp.directive('link', {
    beforeMount(el, binding, vnode) {
      linkBind(el, binding, vnode)
    },
    updated(el, binding, vnode) {
      linkBind(el, binding, vnode)
    },
    beforeUnmount(el, binding, vnode) {
      el.removeEventListener('click', el[LINK_BIND_HANDLER])
      el.__link__bind = null
    }
  })
  // txt 文本内容加载
  vueApp.directive('textLoad', {
    beforeMount(el, binding, vnode) {
      if (!binding.value) return false
      const url = binding.value

      fetch_resouce_from_worker(url, { type: 'text' })
        .then(result => {
          el.innerHTML = result
        })
        .catch(e => {
          Reflect.deleteProperty($GlobalObject._IMAGE_DECRY_SCHEDULER, url)
        })
    }
  })

  vueApp.directive('dom-rect', {
    mounted(el: HTMLImageElement, binding, vnode) {
      const { height } = el.getBoundingClientRect()

      el.style.setProperty('--dom-rect-height', `${height.toFixed(1)}px`)
    }
  })
  //
  console.log(`【${process.client ? 'CSR' : 'SSR'}】@设全局指令函数完成~`)
})
