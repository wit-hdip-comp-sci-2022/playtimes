import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, TrackSpec, TrackArraySpec, PlaylistSpec } from "../models/joi-schemas.js";
import { validationError } from "../utils/logger.js";

export const Tracks = {
  find: {
    auth: false,
    handler: async function (request, h) {
      try {
        const tracks = await db.trackStore.getAllTracks();
        return tracks;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    response: { schema: TrackArraySpec, failAction: validationError },
    description: "Get all tracks",
    notes: "Returns all tracks",
  },

  findOne: {
    auth: false,
    async handler(request) {
      try {
        const track = await db.trackStore.getTrackById(request.params.id);
        if (!track) {
          return Boom.notFound("No track with this id");
        }
        return track;
      } catch (err) {
        return Boom.serverUnavailable("No track with this id");
      }
    },
    tags: ["api"],
    description: "Find a Track",
    notes: "Returns a trackt",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: TrackSpec, failAction: validationError },
  },

  create: {
    auth: false,
    handler: async function (request, h) {
      try {
        const track = await db.trackStore.addTrack(request.params.id, request.payload);
        if (track) {
          return h.response(track).code(201);
        }
        return Boom.badImplementation("error creating track");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a track",
    notes: "Returns the newly created track",
    validate: { payload: TrackSpec },
    response: { schema: TrackSpec, failAction: validationError },
  },

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      try {
        await db.trackStore.deleteAllTracks();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all tracks",
  },

  deleteOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const track = await db.trackStore.getTrackById(request.params.id);
        if (!track) {
          return Boom.notFound("No Track with this id");
        }
        await db.trackStore.deleteTrack(track._id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No Track with this id");
      }
    },
    tags: ["api"],
    description: "Delete a track",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },
};