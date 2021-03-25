/* eslint-disable camelcase */
class ListingDao {
  constructor({ dbPool }) {
    this.dbPool = dbPool;
  }

  addListing = async (body) => {
    const {
      rows,
    } = await this.dbPool.query(
      'INSERT INTO rentr_listing (userid, title, price, num_bedroom, num_bathroom, is_laundry_available, is_pet_allowed, is_parking_available, images, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id;',
      [
        body.userid,
        body.title,
        body.price,
        body.num_bedroom,
        body.num_bathroom,
        body.is_laundry_available,
        body.is_pet_allowed,
        body.is_parking_available,
        body.images,
        body.description,
      ]
    );

    const listingId = rows[0].id;
    return listingId;
  };

  getAllListings = async (query) => {
    const { rows } = await this.dbPool.query(
      `
        SELECT * FROM rentr_listing 
        WHERE 
          COALESCE($1 <= rentr_listing.price, TRUE) AND 
          COALESCE($2 >= rentr_listing.price, TRUE) AND
          COALESCE($3 <= rentr_listing.num_bedroom, TRUE) AND
          COALESCE($4 >= rentr_listing.num_bedroom, TRUE) AND
          COALESCE($5 <= rentr_listing.num_bathroom, TRUE) AND
          COALESCE($6 >= rentr_listing.num_bathroom, TRUE) AND
          COALESCE($7 = rentr_listing.is_laundry_available, TRUE) AND
          COALESCE($8 = rentr_listing.is_pet_allowed, TRUE) AND
          COALESCE($9 = rentr_listing.is_parking_available, TRUE) AND
          CASE WHEN ($10 <> '') IS NOT TRUE
            THEN TRUE
            ELSE to_tsvector(rentr_listing.title) @@ to_tsquery($10) 
          END
        ;
      `,
      [
        query.min_price,
        query.max_price,
        query.min_num_bedroom,
        query.max_num_bedroom,
        query.min_num_bathroom,
        query.max_num_bathroom,
        query.is_laundry_available,
        query.is_pet_allowed,
        query.is_parking_available,
        query.keywords,
      ]
    );
    return rows;
  };

  getListingViaId = async (id) => {
    const {
      rows,
    } = await this.dbPool.query('SELECT * FROM rentr_listing WHERE id = $1;', [
      id,
    ]);

    return rows && rows.length >= 1 ? rows[0] : null;
  };

  updateListing = async (uid, id, body) => {
    const { rows } = await this.dbPool.query(
      `UPDATE rentr_listing
      SET 
        title = (SELECT
                CASE WHEN title = $1 IS NOT NULL THEN $1 
                ELSE rentr_listing.title END
                FROM rentr_listing
                WHERE id = $10),
        userid = $11,
        price = (SELECT
                CASE WHEN price = $2 IS NOT NULL THEN $2 
                ELSE rentr_listing.price END
                FROM rentr_listing
                WHERE id = $10),
        num_bedroom = (SELECT
                CASE WHEN num_bedroom = $3 IS NOT NULL THEN $3 
                ELSE rentr_listing.num_bedroom END
                FROM rentr_listing
                WHERE id = $10),
        num_bathroom = (SELECT
                CASE WHEN num_bathroom = $4 IS NOT NULL THEN $4 
                ELSE rentr_listing.num_bathroom END
                FROM rentr_listing
                WHERE id = $10),
        is_laundry_available = (SELECT
                CASE WHEN is_laundry_available = $5 IS NOT NULL THEN $5 
                ELSE rentr_listing.is_laundry_available END
                FROM rentr_listing
                WHERE id = $10),
        is_pet_allowed = (SELECT
                CASE WHEN is_pet_allowed = $6 IS NOT NULL THEN $6
                ELSE rentr_listing.is_pet_allowed END
                FROM rentr_listing
                WHERE id = $10),
        is_parking_available = (SELECT
                CASE WHEN is_parking_available = $7 IS NOT NULL THEN $7 
                ELSE rentr_listing.is_parking_available END
                FROM rentr_listing
                WHERE id = $10),
        images = (SELECT
                CASE WHEN images = $8 IS NOT NULL THEN $8
                ELSE rentr_listing.images END
                FROM rentr_listing
                WHERE id = $10),
        description = (SELECT
                CASE WHEN description = $9 IS NOT NULL THEN $9
                ELSE rentr_listing.description END
                FROM rentr_listing
                WHERE id = $10)
      WHERE id = $10;`,
      [
        body.title,
        body.price,
        body.num_bedroom,
        body.num_bathroom,
        body.is_laundry_available,
        body.is_pet_allowed,
        body.is_parking_available,
        body.images,
        body.description,
        id,
        uid,
      ]
    );
    return rows;
  };

  deleteListing = async (uid, id) => {
    const {
      rows,
    } = await this.dbPool.query(
      `DELETE FROM rentr_listing WHERE userid = $1 AND id = $2;`,
      [uid, id]
    );
    return rows;
  };

  getListingViaUserId = async (userid) => {
    const {
      rows,
    } = await this.dbPool.query(
      'SELECT * FROM rentr_listing WHERE userid = $1;',
      [userid]
    );

    return rows && rows.length >= 1 ? rows : null;
  };

  getListingViaUserAndListingId = async (userid, id) => {
    const {
      rows,
    } = await this.dbPool.query(
      'SELECT * FROM rentr_listing WHERE (id = $1 and userid = $2);',
      [id, userid]
    );

    return rows && rows.length >= 1 ? rows[0] : null;
  };
}

module.exports = ListingDao;
