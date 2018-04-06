'use strict'

import * as vscode from 'vscode'

const HANKAKU_ASCII = 'extension.hankakuAscii'
const ZENKAKU_ASCII = 'extension.zenkakuAscii'

export const commands_map = new Map<string, ( args: any ) => void>( [
	[ HANKAKU_ASCII, ( option: any ) => { convertToHankakuAscii( option ) } ],
	[ ZENKAKU_ASCII, ( option: any ) => { convertToZenkakuAscii( option ) } ],
] )

/**
 * Convert to hankaku ascii characters
 * @param option option parameters
 */
function convertToHankakuAscii( option?: any ) {
	convertAscii( option, ( str: string ) => {
		return str.replace( /[　！-～“”’]/g, ( s: string ) => {
			if ( s === "　" ) {
				return " "
			} else if ( s === "“" || s === "”" ) {
				return "\""
			} else if ( s === "’" ) {
				return "'"
			} else {
				return String.fromCharCode( s.charCodeAt( 0 ) - 0xFEE0 )
			}
		} )
	} )
}

/**
 * Convert to zenkaku ascii characters
 * @param option option parameters
 */
function convertToZenkakuAscii( option?: any ) {
	convertAscii( option, ( str: string ) => {
		return str.replace( /[ -~]/g, ( s: string ) => {
			return s === " " ? "　" : String.fromCharCode( s.charCodeAt( 0 ) + 0xFEE0 )
		} )
	} )
}

/**
 * 変換メソッドを指定して選択範囲文字列を置き換え。
 * 選択範囲がない場合は該当行を置き換え
 * @param option option parameters
 * @param convert 文字列の変換メソッド
 */
function convertAscii( option: any, convert: ( s: string ) => string ) {
	if ( !option ) {
		option = {}
	}
	const editor = vscode.window.activeTextEditor
	if ( !editor ) {
		vscode.window.showInformationMessage( 'No editor is active' )
		return
	}

	editor.edit( ed => {
		editor.selections.forEach( select => {
			const target_range = select.isEmpty ?
				(()=>{
					const line = editor.document.lineAt( select.start.line )
					return new vscode.Range( line.range.start, line.range.end )
				})()
				 : new vscode.Range( select.start, select.end )
			const text = editor.document.getText( target_range )
			ed.replace( target_range, convert( text ) )
		} )
	} )
}


