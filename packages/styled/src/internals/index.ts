import { CSSObject } from 'styled-components'

export interface Context {
  cancelHalfLeadingPx?: number
  hasVerticalPadding?: boolean
  boxShadowTransition?: boolean
  colorTransition?: boolean
  backgroundColorTransition?: boolean
}

/**
 * 絶対にこれを export してはいけない
 *
 * さもないと `o.bg[internalSym]` みたいな叩き方が可能になってしまう（補完にも意図せず出てしまう）
 */
const internalSym: unique symbol = Symbol('internal')

/**
 * CSSObject に変換可能なオブジェクトを作成する
 *
 * 実際に CSSObject に変換するには外部から `__DO_NOT_USE_GET_INTERNAL__` を使わなければならない
 *
 * これ以降メソッドチェーンが続いてもいいし、続かなくても良い
 */
export function createInternal({
  toCSS,
  context = {},
}: {
  toCSS: (context: Context) => CSSObject
  context?: Context
}): Internal {
  return {
    [internalSym]: {
      toCSS,
      context,
    },
  }
}

export function __DO_NOT_USE_GET_INTERNAL__(internal: Internal) {
  return internal[internalSym]
}

export interface Internal {
  [internalSym]: {
    toCSS: (context: Context) => CSSObject
    context: Context
  }
}

// half-leadingをキャンセルするとき && 垂直方向のpaddingが無い時
// -> before/afterを入れる
export const shouldCancelHalfLeading = ({
  cancelHalfLeadingPx,
  hasVerticalPadding = false,
}: Context) => cancelHalfLeadingPx !== undefined && !hasVerticalPadding
