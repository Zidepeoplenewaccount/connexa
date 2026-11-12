import React from 'react';
import './HarmoniqConnexa.css';

const CONNEXA_LOGO = 'data:image/webp;base64,UklGRhoDAABXRUJQVlA4IA4DAACQGQCdASoIAjUAPpFIoUulpKOhpDaYWLASCWVu3V/6bOPQ+e/lHos03+mfizjkT69Vs4DzAOcB5gOh76AH9g6lH0TfLg/bH4f/tVzFTaV2UmeYTKmfR5qd2IdScnbdOpzhgYB6paf1ce3CkL57eu268KbhJHgfsKwyOAAFTA4E2SjdOPvrIuQWrDR1Jyd0Q6qmNkJSSq3JsaftyoAlOgJlqsXcHcoOEBWSH3onXNwP5Dt+DoD1S092IuQYIqW5NUyrmjBeYjsVAlEssgzA7LTYdftUkgAA/vj2lGylpFU2XbfbTmjS5gLqf4PgMoR/4xvF+/8WuLe33O6iA0rTuAABJtZpOqJbXHgz0PC9eROBUCcXbjE/z14lMMjed+2c3d6RzNBWjZEvN7yGDRiRZE3AxC0v8BLto9xkdVBQWDztZSDKJg8TChXa9TOmUjhvdGKaJEtom/93iYFMVzL+35ncT/vnP7vDeVtTxhWLuDLee1bQDdfZVdo5fV9WRYbwdLizyrhTrByrj8rln2psYd5ZLu7uPIHMlBW1HaQxrzxVQGMI4Mxr1o05GowPcG4MbL+AgJxSEhHEBxLJpwCoTLtoy3fXCKxUYk70tX5tAYm7KaZON5kVc+Q1h43ygCXOzL6Vrd7jWl0KrOZBwTkW9/W5r6D6wDSMoJOeBn/yunP+5HnUP+7dzm8vqibd1Tmm4nG7su5DyJt4Q0dt2D/ANqNfZtN65aKkiGdSC+mjV4aZqOW1f8pUuOGQbDp9AXXi+UcrfPsBUZ2IgayCbuhz9Tmsmx9uOTQsgLPwjtgTHaKAYGURdZbxwguHnZu3VipA7R91uztMsrAsSb8zaA3OExSrYk82gENPjQLY/YvUQ63+K4c+LPqxJfnoPNGZ2KXjcAP04aNF9atGQXLZMfWtk8/wYvm0Sz9BwZb4e1D+sOoJalcI3E1r/fkSuM8L+YXeTQJfttHcd0W+0X1F5GpMJijg6cDkm4/MhqPTo3z08eFu259A6cnSq6H3ltNsCGAPYZ4c0zaLxC1NFJ8oLAAAAA==';
const HARMONIQ_LOGO = 'data:image/webp;base64,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';
const QR_ROWS = [
'111111101010101111111',
'100000101110101000001',
'101110101010101011101',
'101110101011101011101',
'101110100100001011101',
'100000101011101000001',
'111111101010101111111',
'000000001001000000000',
'110110111010110101101',
'001001001111010100010',
'111010111001011011110',
'010101000111100101001',
'101110101000111001110',
'001011011101001110001',
'111101100010111011011',
'000000001111000010100',
'111111101010101101011',
'100000101001111001010',
'101110101111010111101',
'101110100001101010010',
'101110101101011101111',
'100000101011100100001',
'111111101010101011101'
];

export default function HarmoniqConnexa() {
  return (
    <section className="harmoniq-section" id="harmoniq-connect" aria-labelledby="harmoniq-title">
      <div className="harmoniq-wrap">
        <div className="harmoniq-partnership-logos">
          <img src={CONNEXA_LOGO} alt="CONNEXA" className="harmoniq-connexa-logo" />
          <span className="harmoniq-times" aria-hidden="true">×</span>
          <img src={HARMONIQ_LOGO} alt="Harmoniq" className="harmoniq-brand-logo" />
        </div>

        <div className="harmoniq-copy">
          <p className="harmoniq-kicker">DIGITAL NETWORKING PARTNER</p>
          <h2 id="harmoniq-title">Walk in ready.<br /><span>Walk out connected.</span></h2>
          <p className="harmoniq-intro">Make meaningful connections at CONNEXA and keep them beyond the room.</p>
        </div>

        <div className="harmoniq-journey">
          <article className="harmoniq-step">
            <span className="harmoniq-step-number">01</span>
            <p className="harmoniq-step-label">BEFORE</p>
            <h3>Make your card.</h3>
            <p>Skip the fumbling at the door.</p>
          </article>
          <article className="harmoniq-step">
            <span className="harmoniq-step-number">02</span>
            <p className="harmoniq-step-label">DURING</p>
            <h3>Swap with everyone you meet.</h3>
            <p>Their card saves to your contacts.</p>
          </article>
          <article className="harmoniq-step">
            <span className="harmoniq-step-number">03</span>
            <p className="harmoniq-step-label">AFTER</p>
            <h3>Every contact is still there.</h3>
            <p>Follow up the same week.</p>
          </article>
        </div>

        <div className="harmoniq-scan-panel">
          <div className="harmoniq-scan-copy">
            <p className="harmoniq-powered">POWERED BY HARMONIQ</p>
            <h3>Make your card before you arrive.</h3>
            <p>Scan the code to create your digital contact card. Then use it to exchange details throughout the day.</p>
            <a className="harmoniq-card-button" href="https://harmoniq.wstech.studio/e/connexa/?src=qr" target="_blank" rel="noreferrer">Make your card <span aria-hidden="true">↗</span></a>
            <small>One scan. Easier introductions. Better follow-ups.</small>
          </div>
          <a className="harmoniq-qr-link" href="https://harmoniq.wstech.studio/e/connexa/?src=qr" target="_blank" rel="noreferrer" aria-label="Scan or open Harmoniq CONNEXA digital card registration">
            <div className="harmoniq-qr-frame">
              <svg viewBox="0 0 41 41" role="img" aria-label="QR code for Harmoniq CONNEXA digital contact cards" shapeRendering="crispEdges">
                <rect width="41" height="41" fill="#fff" />
                {QR_ROWS.map((row, y) => row.split('').map((cell, x) => cell === '1' ? <rect key={y + '-' + x} x={x} y={y} width="1" height="1" fill="#080808" /> : null)}
              </svg>
            </div>
            <span>SCAN TO MAKE YOUR CARD</span>
          </a>
        </div>
      </div>
    </section>
  );
}
