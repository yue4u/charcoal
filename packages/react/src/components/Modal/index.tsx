import { useContext, forwardRef, memo } from 'react'
import * as React from 'react'
import {
  AriaModalOverlayProps,
  Overlay,
  useModalOverlay,
} from '@react-aria/overlays'
import styled, { css, useTheme } from 'styled-components'
import { theme } from '../../styled'
import { AriaDialogProps } from '@react-types/dialog'
import { maxWidth } from '@charcoal-ui/utils'
import { useMedia } from '@charcoal-ui/styled'
import { animated, useTransition, easings } from 'react-spring'
import Button, { ButtonProps } from '../Button'
import IconButton from '../IconButton'
import { useObjectRef } from '@react-aria/utils'
import { Dialog } from './Dialog'

export type BottomSheet = boolean | 'full'
export type Size = 'S' | 'M' | 'L'

export type ModalProps = AriaModalOverlayProps &
  AriaDialogProps & {
    children: React.ReactNode
    zIndex?: number
    title: string
    size?: Size
    bottomSheet?: BottomSheet
    isOpen: boolean
    onClose: () => void
    className?: string

    /**
     * https://github.com/adobe/react-spectrum/issues/3787
     * Next.jsで使用する際に発生するエラーの一時的な回避策でdocument.bodyを指定する必要がある
     */
    portalContainer?: HTMLElement
  }

const DEFAULT_Z_INDEX = 10

/**
 * モーダルコンポーネント。
 *
 * @example アプリケーションルートで `<OverlayProvider>` ないし `<CharcoalProvider>` で囲った上で利用する
 * ```tsx
 * import {
 *   OverlayProvider,
 *   Modal,
 *   ModalHeader,
 *   ModalBody,
 *   ModalButtons
 * } from '@charcoal-ui/react'
 *
 * <OverlayProvider>
 *   <App>
 *     <Modal title="Title" isOpen={state.isOpen} onClose={() => state.close()} isDismissable>
 *       <ModalHeader />
 *       <ModalBody>
 *         ...
 *         <ModalButtons>...</ModalButtons>
 *       </ModalBody>
 *     </Modal>
 *   </App>
 * </OverlayProvider>
 * ```
 */
const Modal = forwardRef<HTMLDivElement, ModalProps>(function ModalInner(
  { children, zIndex = DEFAULT_Z_INDEX, portalContainer, ...props },
  external
) {
  const {
    title,
    size = 'M',
    bottomSheet = false,
    isDismissable,
    onClose,
    className,
    isOpen = false,
  } = props

  const ref = useObjectRef<HTMLDivElement>(external)

  const { modalProps, underlayProps } = useModalOverlay(
    props,
    {
      close: onClose,
      isOpen: isOpen,
      // these props are not used actually.
      // https://github.com/adobe/react-spectrum/blob/df14e3fb129b94b310f0397a701b83f006b51dfe/packages/%40react-aria/overlays/src/useModalOverlay.ts
      open: () => {
        // nope
      },
      setOpen: () => {
        // nope
      },
      toggle: () => {
        // nope
      },
    },
    ref
  )

  const theme = useTheme()
  const isMobile = useMedia(maxWidth(theme.breakpoint.screen1)) ?? false
  const transitionEnabled = isMobile && bottomSheet !== false
  const showDismiss = !isMobile || bottomSheet !== true

  const transition = useTransition(isOpen, {
    from: {
      transform: 'translateY(100%)',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      overflow: 'hidden',
    },
    enter: {
      transform: 'translateY(0%)',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    update: {
      overflow: 'auto',
    },
    leave: {
      transform: 'translateY(100%)',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      overflow: 'hidden',
    },
    config: transitionEnabled
      ? { duration: 400, easing: easings.easeOutQuart }
      : { duration: 0 },
  })

  return transition(({ backgroundColor, transform, overflow }, item) => {
    return (
      item && (
        <Overlay portalContainer={portalContainer}>
          <ModalBackground
            zIndex={zIndex}
            {...underlayProps}
            style={transitionEnabled ? { backgroundColor, overflow } : {}}
            $bottomSheet={bottomSheet}
          >
            <Dialog
              ref={ref}
              {...modalProps}
              style={transitionEnabled ? { transform } : {}}
              size={size}
              bottomSheet={bottomSheet}
              className={className}
            >
              <ModalContext.Provider
                value={{
                  titleProps: {},
                  title,
                  close: onClose,
                  showDismiss,
                  bottomSheet,
                }}
              >
                {children}
                {isDismissable === true && (
                  <ModalCrossButton
                    size="S"
                    icon="24/Close"
                    onClick={onClose}
                  />
                )}
              </ModalContext.Provider>
            </Dialog>
          </ModalBackground>
        </Overlay>
      )
    )
  })
})

export default memo(Modal)

export const ModalContext = React.createContext<{
  /**
   * @deprecated
   */
  titleProps: React.HTMLAttributes<HTMLElement>
  title: string
  close?: () => void
  showDismiss: boolean
  bottomSheet: BottomSheet
}>({
  titleProps: {},
  title: '',
  close: undefined,
  showDismiss: true,
  bottomSheet: false,
})

const ModalBackground = animated(styled.div<{
  zIndex: number
  $bottomSheet: BottomSheet
}>`
  z-index: ${({ zIndex }) => zIndex};
  overflow: auto;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  padding: 40px 0;
  box-sizing: border-box;

  background-color: ${({ theme }) => theme.color.surface4};

  @media ${({ theme }) => maxWidth(theme.breakpoint.screen1)} {
    ${(p) =>
      p.$bottomSheet !== false &&
      css`
        padding: 0;
      `}
  }
`)

const ModalCrossButton = styled(IconButton)`
  position: absolute;
  top: 8px;
  right: 8px;

  ${theme((o) => [o.font.text3.hover.press])}
`

export function ModalTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  const { titleProps, title } = useContext(ModalContext)
  return (
    <ModalHeading {...titleProps} {...props}>
      {title}
    </ModalHeading>
  )
}

const ModalHeading = styled.h3`
  margin: 0;
  font-weight: inherit;
  font-size: inherit;
`

export function ModalDismissButton({ children, ...props }: ButtonProps) {
  const { close, showDismiss } = useContext(ModalContext)

  if (!showDismiss) {
    return null
  }

  return (
    <Button {...props} onClick={close} fullWidth>
      {children}
    </Button>
  )
}
