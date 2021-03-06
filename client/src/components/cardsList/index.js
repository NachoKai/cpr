/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import TimeAgo from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import englishString from 'react-timeago/lib/language-strings/en';
import { useEffect, useState } from 'react';
import ab2str from 'arraybuffer-to-string';
import { TimeStyle, Container } from './styles';

const formatter = buildFormatter(englishString);

export default function CardsList({ item, imageSrc, link }) {
  const [image, setImage] = useState('');
  const [isPercentage, setIsPercentage] = useState(false);
  useEffect(() => {
    const uint8 = new Uint8Array(imageSrc);
    setImage(ab2str(uint8));
  }, [imageSrc]);

  useEffect(() => {
    if (item.discount) {
      if (item.discount.type === 'Percentage') {
        setIsPercentage(true);
      }
    }
  }, [item.discount]);

  return (
    <Container data-cy="product-card">
      <Card className="card" style={{ height: '400px', width: '320px' }}>
        <Card.Body>
          <Card.Title style={{ textAlign: 'center', height: '26px', overflow: 'hidden' }}>
            {item.name}
          </Card.Title>
          <div className="img-container">
            <span className="item-span" />
            <Card.Img
              variant="top"
              src={`data:image/png;base64, ${image}`}
              className="item-img"
              alt={item.name}
            />
          </div>
          {item.defaultPrice ? (
            <Card.Subtitle
              style={{
                margin: '.3rem 0',
                color: '#575757',
                textDecoration: `${item.discount ? 'line-through' : ''}`,
              }}
            >
              ${item.defaultPrice}
            </Card.Subtitle>
          ) : null}

          {item.discount ? (
            isPercentage ? (
              <Card.Subtitle style={{ margin: '.3rem 0', color: '#B00000' }}>
                -%
                {item.discount.value}
                <span
                  style={{
                    display: 'block',
                    textAlign: 'right',
                    fontWeight: '800',
                  }}
                >
                  ${item.discount.finalPrice}
                </span>
              </Card.Subtitle>
            ) : (
              <Card.Subtitle style={{ margin: '.3rem 0', color: '#B00000' }}>
                -$
                {item.discount.value}
                <span
                  style={{
                    display: 'block',
                    textAlign: 'right',
                    fontWeight: '800',
                  }}
                >
                  ${item.discount.finalPrice}
                </span>
              </Card.Subtitle>
            )
          ) : (
            <Card.Subtitle style={{ height: '38px', margin: '0.3rem' }} />
          )}
          <TimeStyle>
            Posted:
            <TimeAgo date={`${item.createdAt}`} formatter={formatter} />
            <br />
          </TimeStyle>
          <a href={link}>
            <Button
              style={{
                width: '100%',
                backgroundColor: '#0D6572',
                borderColor: '#0D6572',
              }}
              variant="info"
            >
              See Details
            </Button>
          </a>
        </Card.Body>
      </Card>
    </Container>
  );
}
