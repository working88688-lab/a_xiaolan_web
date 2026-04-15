/*
 * @Author: Leo
 * @LastEditors: Leo
 * @LastEditTime: 2024-09-03 17:06:15
 * @Description: 压缩发布文件插件，不想每次发布手动压缩改名
 */

import fs from 'node:fs'
import path from 'node:path'
import AdmZip from 'adm-zip'
import archiver from 'archiver'
import chalk from 'chalk'
import dayjs from 'dayjs'
import fse from 'fs-extra'
import minimist from 'minimist'

import { defineNuxtModule } from 'nuxt/kit'

async function deleteZipFiles(dir: string) {
  const files = await fse.readdir(dir)

  for (const file of files) {
    if (file.endsWith('.zip')) {
      const filePath = path.join(dir, file)
      await fse.remove(filePath)
      console.log(`Deleted: ${file}`)
    }
  }
}

export default defineNuxtModule({
  setup(_options, nuxt) {
    const { rootDir } = nuxt.options
    function _join(file_name: string) {
      return path.join(rootDir, file_name)
    }

    fse.removeSync(_join('dist'))
    fse.removeSync(_join('.output'))

    deleteZipFiles(rootDir).catch(console.error)

    nuxt.hook('close', async () => {
      const args = minimist(process.argv.slice(2))
      const mode = args.mode
      // 压缩包输出路径
      const outdir = args.outdir
      const log = console.log
      const pkg_dir = _join('package.json')
      const source_dir = [_join('dist'), _join('.output/public')].find(p => fs.existsSync(p)) ?? null
      const cache_dir = _join('node_modules/.cache/_dx-build.json')
      const has_cached = fs.existsSync(cache_dir)
      const today = dayjs().format('YYYY-MM-DD')
      const pkg_json = await fse.readJSONSync(pkg_dir)
      const app_name = pkg_json.name
      const app_dir = _join(app_name)

      if (!source_dir) {
        log(
          chalk.yellow(
            '⚠️ 未找到 dist 或 .output/public，跳过发布压缩（prepare / 未完整 generate 时属正常）'
          )
        )
        return
      }

      log(chalk.greenBright(`🤖 开始压缩发布文件 ${source_dir}`))

      let last_version = 1
      if (has_cached) {
        const res = await fse.readJsonSync(cache_dir)
        if (res[today]) {
          last_version = res[today] + 1
        }
      }

      const mode_label = mode ?? 'build'
      const zip_file_name = _join(`${app_name}-${mode_label}-v${today}-${last_version}.zip`)
      fse.copy(source_dir, app_dir, err => {
        if (err) {
          log(chalk.redBright(`❌: ${err}`))
          return
        }

        log(chalk.green('ℹ️ 复制静态资源完成'))

        const output = fs.createWriteStream(zip_file_name)
        const archive = archiver('zip', { zlib: { level: 9 } })

        output.on('close', async () => {
          fse.writeJson(cache_dir, {
            [today]: last_version
          })
          fse.remove(app_dir)
          log(chalk.green(`🚀 文件大小: ${(archive.pointer() / (1024 * 1024)).toFixed(2)}MB`))

          log(chalk.greenBright(`✅ ${zip_file_name} 压缩完成  `))
          // 压缩包输出路径
          if (outdir) {
            try {
              const nginx_static_zip_dir = path.join(outdir, 'dist')
              const nginx_static_app_dir = path.join(outdir, app_name)
              const zip = new AdmZip(zip_file_name)
              zip.extractAllTo(outdir, true)
              await fse.remove(nginx_static_app_dir)
              await fse.rename(nginx_static_zip_dir, nginx_static_app_dir)
              log(chalk.greenBright(`✅ 文件已部署到本地nginx环境`))
            } catch (error: any) {
              log(chalk.red(error?.message ?? error?.toString() ?? error))
            }
          }
        })

        archive.pipe(output)

        archive.directory(app_dir, 'dist')

        archive.finalize()
      })
    })
  }
})
